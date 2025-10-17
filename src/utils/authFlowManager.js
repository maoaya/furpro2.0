/**
 * MANAGER DE FLUJO DE AUTENTICACIÓN COMPLETO
 * 
 * Este módulo coordina todo el flujo desde autenticación hasta navegación exitosa a HomePage
 * Soluciona el problema de que los usuarios no llegan a /home después de autenticarse
 */

import { navigateToHome, handleSuccessfulAuth, markAuthenticationComplete } from './navigationUtils.js';
import { registrarUsuarioCompleto } from './registroCompleto.js';
import supabase, { supabaseAuth } from '../supabaseClient.js'; // Importar ambos clientes

/**
 * Manager principal del flujo de autenticación
 */
export class AuthFlowManager {
  constructor() {
    this.debugMode = true;
    this.maxRetries = 3;
    this.navigationDelay = 500;
  }

  /**
   * Logs con formato consistente
   */
  log(message, type = 'info') {
    const emoji = {
      info: '🔄',
      success: '✅', 
      error: '❌',
      warning: '⚠️'
    };
    console.log(`${emoji[type]} [AuthFlowManager] ${message}`);
  }

  /**
   * Maneja el flujo completo después del login exitoso
   */
  async handlePostLoginFlow(user, navigate = null, additionalData = {}) {
    this.log('Iniciando flujo post-login completo');
    
    try {
      // 1. Verificar que el usuario esté válido
      if (!user || !user.id) {
        throw new Error('Usuario inválido recibido');
      }

      this.log(`Usuario autenticado: ${user.email}`);

      // 2. Guardar datos en localStorage inmediatamente
      localStorage.setItem('authCompleted', 'true');
      localStorage.setItem('loginSuccess', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('session', JSON.stringify(user));

      // 3. Forzar actualización del contexto de autenticación
      window.dispatchEvent(new CustomEvent('authUpdate', { 
        detail: { user, action: 'login' } 
      }));

      // 4. Verificar/crear perfil de usuario en la base de datos
      await this.ensureUserProfile(user, additionalData);

      // 5. Marcar autenticación como completa
      await markAuthenticationComplete(user);

      // 6. Pequeño delay para asegurar que todo se procese
      await this.delay(1000);

      // 7. Ejecutar navegación robusta a HomePage
      await this.executeRobustNavigation(navigate);

      this.log('Flujo post-login completado exitosamente', 'success');
      return { success: true };

    } catch (error) {
      this.log(`Error en flujo post-login: ${error.message}`, 'error');
      
      // Intentar navegación de emergencia incluso con errores
      this.executeEmergencyNavigation(navigate);
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Asegura que el perfil del usuario existe en la base de datos
   */
  async ensureUserProfile(user, additionalData = {}) {
    try {
      // Verificar si ya existe el perfil
      const { data: existingProfile, error: fetchError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        this.log('Perfil de usuario ya existe');
        return existingProfile;
      }

      // Si no existe, crear perfil básico
      this.log('Creando perfil de usuario...');
      
      const profileData = {
        id: user.id,
        email: user.email,
        nombre: additionalData.nombre || user.user_metadata?.nombre || user.email.split('@')[0],
        apellido: additionalData.apellido || user.user_metadata?.apellido || '',
        rol: 'player',
        estado: 'activo',
        fecha_registro: new Date().toISOString(),
        email_verificado: true
      };

      const { data: newProfile, error: createError } = await supabase
        .from('usuarios')
        .insert([profileData])
        .select()
        .single();

      if (createError) {
        this.log(`Error creando perfil: ${createError.message}`, 'warning');
        // No es crítico, continuar con la navegación
      } else {
        this.log('Perfil de usuario creado exitosamente');
      }

      return newProfile || profileData;

    } catch (error) {
      this.log(`Error verificando/creando perfil: ${error.message}`, 'warning');
      // No es crítico para la navegación
      return null;
    }
  }

  /**
   * Ejecuta navegación robusta con múltiples intentos
   */
  async executeRobustNavigation(navigate = null) {
    this.log('Ejecutando navegación robusta a HomePage');

    // Intento 1: React Router inmediato
    if (navigate && typeof navigate === 'function') {
      try {
        this.log('Intento 1: React Router navigate inmediato');
        navigate('/home', { replace: true });
        
        // Verificar éxito después de un delay
        const navigationSuccess = await this.verifyNavigation(1000);
        if (navigationSuccess) {
          this.log('Navegación exitosa con React Router', 'success');
          return true;
        }
      } catch (error) {
        this.log(`Error con React Router: ${error.message}`, 'warning');
      }
    }

    // Intento 2: React Router con delay
    if (navigate && typeof navigate === 'function') {
      try {
        this.log('Intento 2: React Router navigate con delay');
        await this.delay(this.navigationDelay);
        navigate('/home', { replace: true });
        
        const navigationSuccess = await this.verifyNavigation(1500);
        if (navigationSuccess) {
          this.log('Navegación exitosa con React Router (delayed)', 'success');
          return true;
        }
      } catch (error) {
        this.log(`Error con React Router delayed: ${error.message}`, 'warning');
      }
    }

    // Intento 3: window.location.href
    try {
      this.log('Intento 3: window.location.href');
      window.location.href = '/home';
      return true;
    } catch (error) {
      this.log(`Error con window.location.href: ${error.message}`, 'warning');
    }

    // Intento 4: window.location.replace (último recurso)
    try {
      this.log('Intento 4: window.location.replace (último recurso)');
      window.location.replace('/home');
      return true;
    } catch (error) {
      this.log(`Error con window.location.replace: ${error.message}`, 'error');
    }

    throw new Error('Todos los métodos de navegación fallaron');
  }

  /**
   * Navegación de emergencia sin verificaciones
   */
  executeEmergencyNavigation(navigate = null) {
    this.log('Ejecutando navegación de emergencia', 'warning');
    
    try {
      if (navigate) {
        navigate('/home', { replace: true });
      }
      setTimeout(() => {
        window.location.href = '/home';
      }, 500);
    } catch (error) {
      window.location.href = '/home';
    }
  }

  /**
   * Verifica si la navegación fue exitosa
   */
  async verifyNavigation(timeoutMs = 1000) {
    return new Promise((resolve) => {
      const checkInterval = 100;
      let elapsed = 0;

      const interval = setInterval(() => {
        if (window.location.pathname === '/home') {
          clearInterval(interval);
          resolve(true);
          return;
        }

        elapsed += checkInterval;
        if (elapsed >= timeoutMs) {
          clearInterval(interval);
          resolve(false);
        }
      }, checkInterval);
    });
  }

  /**
   * Utility para delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Maneja el flujo completo de registro + login
   */
  async handleCompleteRegistrationFlow(formData, navigate = null) {
    this.log('Iniciando flujo completo de registro');
    
    try {
      // 1. Ejecutar registro completo
      const registroResult = await registrarUsuarioCompleto(formData);
      
      if (!registroResult.success) {
        throw new Error(registroResult.error || 'Error en registro');
      }

      this.log('Registro completado, esperando autenticación...', 'success');

      // 2. Esperar a que Supabase procese la autenticación
      await this.delay(2000);

      // 3. Verificar estado de autenticación (usar cliente Auth)
      const { data: { session }, error } = await supabaseAuth.auth.getSession();
      
      if (session && session.user) {
        this.log('Sesión activa detectada después del registro');
        
        // 4. Ejecutar flujo post-login
        return await this.handlePostLoginFlow(session.user, navigate, {
          nombre: formData.nombre,
          apellido: formData.apellido
        });
      } else {
        this.log('No se detectó sesión activa, pero registro exitoso', 'warning');
        
        // Intentar navegación de todos modos
        this.executeEmergencyNavigation(navigate);
        
        return { 
          success: true, 
          message: 'Registro exitoso. Si no fuiste redirigido automáticamente, haz clic en el botón de inicio.' 
        };
      }

    } catch (error) {
      this.log(`Error en flujo completo de registro: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
}

// Instancia singleton del manager
export const authFlowManager = new AuthFlowManager();

/**
 * Función de utilidad para manejar autenticación exitosa
 * Compatible con componentes existentes
 */
export async function handleAuthenticationSuccess(user, navigate = null, additionalData = {}) {
  return await authFlowManager.handlePostLoginFlow(user, navigate, additionalData);
}

/**
 * Función de utilidad para manejar registro completo
 * Compatible con componentes existentes  
 */
export async function handleCompleteRegistration(formData, navigate = null) {
  return await authFlowManager.handleCompleteRegistrationFlow(formData, navigate);
}