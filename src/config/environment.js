// Configuración dinámica para producción
export const getConfig = () => {
  const isProduction = window.location.hostname === 'futpro.vip' || 
                      window.location.hostname.includes('futpro.vip');
  
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';

  console.log('🌍 Entorno detectado:', { 
    hostname: window.location.hostname, 
    isProduction, 
    isDevelopment 
  });

  return {
    // URLs base
    baseUrl: isProduction ? 'https://futpro.vip' : 'http://localhost:3000',
    
    // URLs de callback para OAuth
    oauthCallbackUrl: isProduction 
      ? 'https://futpro.vip/auth/callback'
      : 'http://localhost:3000/auth/callback',
    
    // URLs de callback premium
    premiumCallbackUrl: isProduction 
      ? 'https://futpro.vip/auth/callback-premium'
      : 'http://localhost:3000/auth/callback-premium',
    
    // Configuraciones de Supabase
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    
    // Flags de entorno
    isProduction,
    isDevelopment,
    
    // Configuraciones de debug
    enableDebugLogs: isDevelopment,
    
    // URLs de API
    apiUrl: isProduction ? 'https://futpro.vip/api' : 'http://localhost:3000/api',
  };
};

export default getConfig;