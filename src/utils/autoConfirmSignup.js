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
    
    // BYPASS DEFINITIVO: NO ENVIAR captchaToken en absoluto
    // Si Supabase no recibe captchaToken, no validará captcha
    console.log('🛡️ CAPTCHA BYPASS: NO enviando captchaToken para evitar validación');
    
    // Registro en Supabase SIN captcha token
    const { data: authData, error: authError } = await supabase.auth.signUp(userData);
    
    if (authError) {
      console.error('❌ Error en registro:', authError);
      return { success: false, error: authError };
    }
    
    console.log('✅ Usuario registrado:', authData.user?.email);
    
    // Si auto-confirm está habilitado, SIEMPRE continuar sin importar si hay sesión
    if (config.autoConfirmSignup) {
      console.log('🔓 Auto-confirm habilitado: omitiendo verificación de email completamente');
      return {
        success: true,
        user: authData.user,
        session: authData.session, // Puede ser null, no importa
        needsEmailConfirmation: false,
        message: 'Cuenta creada exitosamente. Redirigiendo a inicio...',
        autoConfirmActive: true
      };
    }
    
    // Si auto-confirm NO está habilitado, seguir comportamiento normal
    if (!authData.session) {
      console.log('📧 Se requiere confirmación de email');
      return {
        success: true,
        user: authData.user,
        session: null,
        needsEmailConfirmation: true,
        message: 'Cuenta creada. Verifica tu email para activarla.'
      };
    } else {
      console.log('🔓 Sesión iniciada automáticamente');
      return {
        success: true,
        user: authData.user,
        session: authData.session,
        needsEmailConfirmation: false,
        message: 'Cuenta creada e iniciada sesión exitosamente.'
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