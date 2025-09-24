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

  // Función para procesar el callback
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
        
        // Obtener datos pendientes del perfil
        const perfilPendiente = localStorage.getItem('pendingProfileData');
        
        if (perfilPendiente) {
          const datosPerfilConUser = JSON.parse(perfilPendiente);
          datosPerfilConUser.id = data.session.user.id;
          datosPerfilConUser.email = data.session.user.email;
          datosPerfilConUser.auth_provider = data.session.user.app_metadata?.provider;
          
          // Guardar en base de datos
          const { data: usuarioGuardado, error: errorGuardar } = await supabase
            .from('usuarios')
            .insert([datosPerfilConUser])
            .select()
            .single();
            
          if (errorGuardar) {
            console.error('❌ ERROR AL GUARDAR USUARIO:', errorGuardar);
            return { success: false, error: errorGuardar.message };
          }
          
          console.log('✅ USUARIO GUARDADO EN BD:', usuarioGuardado);
          
          // Limpiar datos temporales
          localStorage.removeItem('pendingProfileData');
          localStorage.removeItem('registroProgreso');
          localStorage.removeItem('tempRegistroData');
          
          return { 
            success: true, 
            user: usuarioGuardado,
            message: 'Registro completado exitosamente'
          };
        }
        
        return { 
          success: true, 
          user: data.session.user,
          message: 'Usuario existente autenticado'
        };
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
  }
};

// Exportar cliente también
export default supabase;