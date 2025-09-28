// Configuración dinámica para producción
export const getConfig = () => {
  const isProduction = window.location.hostname === 'futpro.vip' || 
                      window.location.hostname.includes('futpro.vip') ||
                      window.location.hostname.includes('netlify.app');
  
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';

  const isNetlify = window.location.hostname.includes('netlify.app');

  console.log('🌍 Entorno detectado:', { 
    hostname: window.location.hostname, 
    isProduction, 
    isDevelopment,
    isNetlify,
    protocol: window.location.protocol
  });

  // Determinar URL base correcta
  const baseUrl = isProduction 
    ? (window.location.hostname === 'futpro.vip' ? 'https://futpro.vip' : window.location.origin)
    : 'http://localhost:3000';

  return {
    // URLs base
    baseUrl,
    
    // URLs de callback para OAuth
    oauthCallbackUrl: isProduction 
      ? `${baseUrl}/auth/callback`
      : 'http://localhost:3000/auth/callback',
    
    // URLs específicas para home después del login
    homeRedirectUrl: isProduction 
      ? `${baseUrl}/home`
      : 'http://localhost:3000/home',
    
    // URLs de callback premium
    premiumCallbackUrl: isProduction 
      ? `${baseUrl}/auth/callback-premium`
      : 'http://localhost:3000/auth/callback-premium',
    
    // Configuraciones de Supabase
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    
    // OAuth credentials
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    facebookClientId: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
    
    // Flags de entorno
    isProduction,
    isDevelopment,
    isNetlify,
    
    // Configuraciones de debug
    enableDebugLogs: isDevelopment,
    
    // URLs de API
    apiUrl: isProduction ? `${baseUrl}/api` : 'http://localhost:3000/api',
  };
};

export default getConfig;