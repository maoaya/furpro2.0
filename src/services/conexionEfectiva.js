// Conexión real y efectiva - Sistema completo OAuth para PRODUCCIÓN
import { createClient } from '@supabase/supabase-js';

// Configuración directa y efectiva
const supabaseUrl = 'https://qqrxetxcglwrejtblwut.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.F6GSIfkPgpgrcXkJU8b2PHhv-T5Lh36WSS2xdiuH-C8';

// Cliente Supabase configurado
const supabase = createClient(supabaseUrl, supabaseKey);

// Detección automática de entorno
const detectarEntorno = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const esProduccion = hostname === 'futpro.vip' || hostname === 'www.futpro.vip';
  
  return {
    esProduccion,
    esDesarrollo: !esProduccion,
    hostname,
    baseUrl: esProduccion ? 'https://futpro.vip' : 'http://localhost:3000',
    callbackUrl: esProduccion ? 'https://futpro.vip/auth/callback' : 'http://localhost:3000/auth/callback'
  };
};

// Sistema de conexión real y efectiva
export const conexionEfectiva = {
  
  // Función principal de registro con OAuth - PRODUCCIÓN LISTA
  async registrarConGoogle() {
    const entorno = detectarEntorno();
    console.log('🚀 INICIANDO CONEXIÓN REAL CON GOOGLE EN:', entorno.hostname);
    console.log('🌍 Entorno detectado:', entorno);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: entorno.callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('❌ ERROR EN CONEXIÓN:', error);
        console.error('🔧 Callback URL usado:', entorno.callbackUrl);
        return { success: false, error: error.message };
      }

      console.log('✅ REDIRECCIÓN A GOOGLE INICIADA EN:', entorno.esProduccion ? 'PRODUCCIÓN' : 'DESARROLLO');
      return { success: true, redirecting: true };
      
    } catch (err) {
      console.error('💥 ERROR INESPERADO:', err);
      return { success: false, error: err.message };
    }
  },

  // Función para Facebook - PRODUCCIÓN LISTA
  async registrarConFacebook() {
    const entorno = detectarEntorno();
    console.log('🚀 INICIANDO CONEXIÓN REAL CON FACEBOOK EN:', entorno.hostname);
    console.log('🌍 Entorno detectado:', entorno);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: entorno.callbackUrl
        }
      });

      if (error) {
        console.error('❌ ERROR EN CONEXIÓN FACEBOOK:', error);
        console.error('🔧 Callback URL usado:', entorno.callbackUrl);
        return { success: false, error: error.message };
      }

      console.log('✅ REDIRECCIÓN A FACEBOOK INICIADA EN:', entorno.esProduccion ? 'PRODUCCIÓN' : 'DESARROLLO');
      return { success: true, redirecting: true };
      
    } catch (err) {
      console.error('💥 ERROR INESPERADO FACEBOOK:', err);
      return { success: false, error: err.message };
    }
  },

  // Función para procesar el callback - MEJORADA
  async procesarCallback() {
    console.log('🔄 PROCESANDO CALLBACK DE OAUTH...');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ ERROR AL OBTENER SESIÓN:', error);
        return { success: false, error: error.message };
      }

      if (data.session && data.session.user) {
        console.log('✅ USUARIO AUTENTICADO:', data.session.user.email);
        
        // Verificar si el usuario ya existe
        const { data: usuarioExistente, error: errorBusqueda } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (usuarioExistente) {
          console.log('✅ USUARIO EXISTENTE ENCONTRADO:', usuarioExistente);
          // Limpiar datos temporales
          localStorage.removeItem('pendingProfileData');
          localStorage.removeItem('registroProgreso');
          localStorage.removeItem('tempRegistroData');
          
          return { 
            success: true, 
            user: usuarioExistente,
            message: 'Bienvenido de vuelta'
          };
        }
        
        // Si no existe, crear nuevo usuario con datos del perfil
        const perfilPendiente = localStorage.getItem('pendingProfileData');
        
        if (perfilPendiente) {
          const datosPerfilConUser = JSON.parse(perfilPendiente);
          
          // Preparar datos completos para insert
          const usuarioCompleto = {
            id: data.session.user.id,
            email: data.session.user.email,
            nombre: datosPerfilConUser.nombre,
            edad: datosPerfilConUser.edad,
            peso: datosPerfilConUser.peso,
            ciudad: datosPerfilConUser.ciudad,
            pais: datosPerfilConUser.pais,
            posicion_favorita: datosPerfilConUser.posicion_favorita,
            frecuencia_juego: datosPerfilConUser.frecuencia_juego,
            avatar_url: datosPerfilConUser.avatar_url,
            rol: datosPerfilConUser.rol || 'usuario',
            tipo_usuario: datosPerfilConUser.tipo_usuario || 'jugador',
            funciones_adicionales: datosPerfilConUser.funciones_adicionales || [],
            auth_provider: data.session.user.app_metadata?.provider || 'oauth',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            activo: true
          };
          
          console.log('💾 INSERTANDO USUARIO COMPLETO:', usuarioCompleto);
          
          // Guardar en base de datos con retry
          let intentos = 0;
          let usuarioGuardado = null;
          
          while (intentos < 3) {
            const { data: resultado, error: errorGuardar } = await supabase
              .from('usuarios')
              .insert([usuarioCompleto])
              .select()
              .single();
              
            if (!errorGuardar) {
              usuarioGuardado = resultado;
              break;
            }
            
            console.warn(`⚠️ Intento ${intentos + 1} falló:`, errorGuardar.message);
            intentos++;
            
            if (intentos >= 3) {
              console.error('❌ ERROR AL GUARDAR USUARIO DESPUÉS DE 3 INTENTOS:', errorGuardar);
              return { success: false, error: `Error guardando usuario: ${errorGuardar.message}` };
            }
            
            // Esperar un poco antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          if (usuarioGuardado) {
            console.log('✅ USUARIO GUARDADO PERMANENTEMENTE:', usuarioGuardado);
            
            // Limpiar datos temporales
            localStorage.removeItem('pendingProfileData');
            localStorage.removeItem('registroProgreso');  
            localStorage.removeItem('tempRegistroData');
            
            // Confirmación adicional de que el usuario está en BD
            const { data: confirmacion } = await supabase
              .from('usuarios')
              .select('*')
              .eq('id', usuarioGuardado.id)
              .single();
            
            if (confirmacion) {
              console.log('✅ CONFIRMACIÓN: Usuario existe en BD:', confirmacion.email);
            }
            
            return { 
              success: true, 
              user: usuarioGuardado,
              message: 'Registro completado exitosamente'
            };
          }
        } else {
          // No hay datos de perfil pendientes, crear usuario básico
          const usuarioBasico = {
            id: data.session.user.id,
            email: data.session.user.email,
            nombre: data.session.user.user_metadata?.full_name || data.session.user.email.split('@')[0],
            auth_provider: data.session.user.app_metadata?.provider || 'oauth',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            activo: true
          };
          
          const { data: usuarioCreado, error: errorCrear } = await supabase
            .from('usuarios')
            .insert([usuarioBasico])
            .select()
            .single();
            
          if (errorCrear) {
            console.error('❌ ERROR CREANDO USUARIO BÁSICO:', errorCrear);
            return { success: false, error: errorCrear.message };
          }
          
          console.log('✅ USUARIO BÁSICO CREADO:', usuarioCreado);
          return { 
            success: true, 
            user: usuarioCreado,
            message: 'Usuario creado exitosamente'
          };
        }
      }
      
      return { success: false, error: 'No se encontró sesión activa' };
      
    } catch (err) {
      console.error('💥 ERROR EN CALLBACK:', err);
      return { success: false, error: err.message };
    }
  },

  // Función de verificación de conexión - PRODUCCIÓN/DESARROLLO
  async verificarConexion() {
    const entorno = detectarEntorno();
    console.log('🔍 VERIFICANDO CONEXIÓN EN:', entorno.esProduccion ? 'PRODUCCIÓN (futpro.vip)' : 'DESARROLLO (localhost)');
    console.log('🌍 Configuración automática:', entorno);
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.log('❌ Error de conexión:', error.message);
        return false;
      }
      
      console.log('✅ CONEXIÓN A SUPABASE VERIFICADA');
      console.log('🎯 URLs configuradas para:', entorno.esProduccion ? 'PRODUCCIÓN' : 'DESARROLLO');
      console.log('📍 Callback URL:', entorno.callbackUrl);
      
      return true;
      
    } catch (err) {
      console.log('❌ Error verificando conexión:', err.message);
      return false;
    }
  },

  // Función para verificar si un usuario está registrado permanentemente
  async verificarUsuarioRegistrado(userId) {
    console.log('🔍 VERIFICANDO REGISTRO PERMANENTE DEL USUARIO:', userId);
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.log('❌ Usuario no encontrado en BD:', error.message);
        return { exists: false, error: error.message };
      }
      
      if (data) {
        console.log('✅ USUARIO CONFIRMADO EN BD:', data.email);
        return { exists: true, user: data };
      }
      
      return { exists: false, error: 'Usuario no encontrado' };
      
    } catch (err) {
      console.error('💥 Error verificando usuario:', err);
      return { exists: false, error: err.message };
    }
  },

  // Función para obtener estadísticas de registro
  async obtenerEstadisticasRegistro() {
    console.log('📊 OBTENIENDO ESTADÍSTICAS DE REGISTRO...');
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, email, nombre, auth_provider, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ ÚLTIMOS USUARIOS REGISTRADOS:', data.length);
      data.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.auth_provider}) - ${user.created_at}`);
      });
      
      return { success: true, usuarios: data };
      
    } catch (err) {
      console.error('💥 Error obteniendo estadísticas:', err);
      return { success: false, error: err.message };
    }
  }
};

// Exportar cliente también
export default supabase;