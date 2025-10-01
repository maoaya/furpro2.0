// Utilitario de CAPTCHA para Supabase Auth
// BYPASS TOTAL para futpro.vip - versión simplificada

const IS_DEVELOPMENT = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.startsWith('localhost:');

const IS_FUTPRO_VIP = window.location.hostname === 'futpro.vip' || 
                     window.location.hostname.includes('futpro.vip') ||
                     window.location.hostname.includes('netlify.app');

// Token mock para bypass total
const MOCK_TOKEN = 'bypass-futpro-vip-' + Date.now();

/**
 * Obtiene token de captcha - SIEMPRE bypass en futpro.vip
 * @returns {Promise<string>} Token mock
 */
export async function getCaptchaTokenSafe() {
  try {
    if (IS_FUTPRO_VIP) {
      console.info('[CAPTCHA] 🚀 futpro.vip: BYPASS AUTOMÁTICO ACTIVADO');
      return MOCK_TOKEN;
    }
    
    if (IS_DEVELOPMENT) {
      console.info('[CAPTCHA] 🔧 Desarrollo: BYPASS ACTIVADO');
      return MOCK_TOKEN;
    }
    
    // Fallback para cualquier otro caso
    console.info('[CAPTCHA] 🛡️ Bypass por defecto activado');
    return MOCK_TOKEN;
    
  } catch (e) {
    console.warn('[CAPTCHA] ❌ Error, bypass de emergencia:', e.message);
    return MOCK_TOKEN;
  }
}

/**
 * Información del proveedor de captcha - siempre bypass
 * @returns {Object} Info del provider
 */
export function getCaptchaProviderInfo() {
  if (IS_FUTPRO_VIP) {
    return {
      provider: 'bypass-futpro-vip',
      siteKey: 'disabled-automatic',
      isDevelopment: IS_DEVELOPMENT,
      status: 'bypassed',
      reason: 'futpro-vip-auto-bypass'
    };
  }
  
  return {
    provider: 'bypass-default',
    siteKey: 'disabled-default',
    isDevelopment: IS_DEVELOPMENT,
    status: 'bypassed',
    reason: 'default-bypass'
  };
}