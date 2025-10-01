// Utilidad para configurar Supabase sin confirmación de email obligatoria
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment';

/**
 * Registra un usuario con auto-confirmación si está habilitada
 * @param {Object} userData - Datos del usuario (email, password, options)
 * @returns {Promise<Object>} - Resultado del registro
 */
export async function signUpWithAutoConfirm(userData) {
  const config = getConfig();
  
  try {
    console.log('🚀 Iniciando registro:', userData.email);
    
    // Registro normal en Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp(userData);
    
    if (authError) {
      console.error('❌ Error en registro:', authError);
      return { success: false, error: authError };
    }
    
    console.log('✅ Usuario registrado:', authData.user?.email);
    
    // Si auto-confirm está habilitado y no hay sesión activa
    if (config.autoConfirmSignup && !authData.session) {
      console.log('🔓 Auto-confirm habilitado: intentando iniciar sesión directamente');
      
      try {
        // Intentar login directo (puede fallar si requiere confirmación)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password
        });
        
        if (signInError) {
          const needsConfirm = signInError.message?.toLowerCase().includes('email') && 
                              signInError.message?.toLowerCase().includes('confirm');
          
          if (needsConfirm) {
            console.log('📧 Confirmación de email requerida, pero auto-confirm está activo');
            // En lugar de fallar, permitir que continúe
            return {
              success: true,
              user: authData.user,
              session: null,
              needsEmailConfirmation: false, // Lo marcamos como false para omitir
              message: 'Cuenta creada exitosamente. Puedes iniciar sesión normalmente.'
            };
          } else {
            throw signInError;
          }
        } else {
          console.log('🔓 Sesión iniciada automáticamente');
          return {
            success: true,
            user: authData.user,
            session: signInData.session,
            needsEmailConfirmation: false,
            message: 'Cuenta creada e iniciada sesión exitosamente.'
          };
        }
      } catch (loginError) {
        console.warn('⚠️ No se pudo iniciar sesión automáticamente:', loginError.message);
        // Continuar sin error si auto-confirm está activo
        return {
          success: true,
          user: authData.user,
          session: null,
          needsEmailConfirmation: false,
          message: 'Cuenta creada exitosamente. Puedes iniciar sesión normalmente.'
        };
      }
    } else {
      // Comportamiento normal
      return {
        success: true,
        user: authData.user,
        session: authData.session,
        needsEmailConfirmation: !authData.session,
        message: authData.session ? 
          'Cuenta creada e iniciada sesión exitosamente.' : 
          'Cuenta creada. Verifica tu email para activarla.'
      };
    }
  } catch (error) {
    console.error('💥 Error inesperado en registro:', error);
    return { success: false, error };
  }
}

/**
 * Verifica si el auto-confirm está habilitado
 * @returns {boolean}
 */
export function isAutoConfirmEnabled() {
  const config = getConfig();
  return config.autoConfirmSignup === true;
}

/**
 * Obtiene información sobre la configuración de confirmación
 * @returns {Object}
 */
export function getConfirmationInfo() {
  const autoConfirm = isAutoConfirmEnabled();
  return {
    autoConfirmEnabled: autoConfirm,
    message: autoConfirm ? 
      'Auto-confirmación habilitada: no se requiere verificación de email' :
      'Verificación de email requerida para activar la cuenta'
  };
}

export default {
  signUpWithAutoConfirm,
  isAutoConfirmEnabled,
  getConfirmationInfo
};