// Utilitario de CAPTCHA para Supabase Auth
// BYPASS TOTAL ULTRA-AGRESIVO para futpro.vip

/**
 * BYPASS TOTAL - SIEMPRE RETORNA TRUE
 * @returns {Promise<string>} Token bypass
 */
export async function getCaptchaTokenSafe() {
  // BYPASS ULTRA-AGRESIVO: SIEMPRE retorna token válido
  const mockToken = 'futpro-vip-bypass-' + Date.now() + '-' + Math.random();
  console.info('[CAPTCHA] � BYPASS TOTAL ACTIVADO - SIEMPRE');
  return mockToken;
}

/**
 * BYPASS TOTAL - Información del proveedor
 * @returns {Object} Info bypass
 */
export function getCaptchaProviderInfo() {
  return {
    provider: 'bypass-total',
    siteKey: 'disabled-ultra-bypass',
    status: 'bypassed-always',
    reason: 'ultra-aggressive-bypass-futpro-vip'
  };
}

/**
 * BYPASS TOTAL - Verificación
 * @returns {boolean} Siempre true
 */
export function verifyCaptcha() {
  console.info('[CAPTCHA] 🚀 VERIFICACIÓN BYPASS - SIEMPRE TRUE');
  return true;
}

/**
 * BYPASS TOTAL - Token directo
 * @returns {string} Token bypass
 */
export function getBypassToken() {
  return 'futpro-vip-ultra-bypass-' + Date.now();
}