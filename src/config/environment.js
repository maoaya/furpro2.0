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
  // En desarrollo, usar el origen actual (p.ej. Vite en 5173). En prod, fijar dominio.
  const baseUrl = isProduction 
    ? (window.location.hostname === 'futpro.vip' ? 'https://futpro.vip' : window.location.origin)
    : window.location.origin;

  return {
    // URLs base
    baseUrl,
    
    // URLs de callback para OAuth
      oauthCallbackUrl: `${baseUrl}/auth/callback`,
    
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
  // API del backend local corre en 3000; en prod va bajo el mismo dominio
  apiUrl: isProduction ? `${baseUrl}/api` : 'http://localhost:3000/api',
  };
};

export default getConfig;