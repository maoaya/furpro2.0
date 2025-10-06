// Configuración dinámica para producción
// Variables de configuración - compatibles con Jest y navegador
let SUPABASE_URL, SUPABASE_ANON_KEY, GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID;

// En Jest/Node.js, usar process.env (definido en jest.setup.js)
if (typeof process !== 'undefined' && process.env) {
  SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
  GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
  FACEBOOK_CLIENT_ID = process.env.VITE_FACEBOOK_CLIENT_ID;
}

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
    
    // URLs específicas para home después del login (usar SIEMPRE el mismo origen del frontend)
    homeRedirectUrl: `${baseUrl}/home`,
    
    // URLs de callback premium (usar SIEMPRE el mismo origen del frontend)
    premiumCallbackUrl: `${baseUrl}/auth/callback-premium`,
    
    // Configuraciones de Supabase - Compatible con Jest y navegador
    supabaseUrl: SUPABASE_URL || 'https://qqrxetxcglwrejtblwut.supabase.co',
    supabaseAnonKey: SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4MzQwMTQsImV4cCI6MjA0MTQxMDAxNH0.WaJRwm3fGSoOZzYpU5xhMc82rP6FqJKM52kQGYlXJz8',
    
    // OAuth credentials - Compatible con Jest y navegador  
    googleClientId: GOOGLE_CLIENT_ID || '760210878835-bnl2k6qfb4vuhm9v6fqpj1dqh5kul6d8.apps.googleusercontent.com',
    facebookClientId: FACEBOOK_CLIENT_ID || '',
    
    // Flags de entorno
    isProduction,
    isDevelopment,
    isNetlify,
    autoConfirmSignup: (typeof process !== 'undefined' && process.env?.VITE_AUTO_CONFIRM_SIGNUP === 'true'),
    
    // Configuraciones de debug
    enableDebugLogs: isDevelopment,
    
    // URLs de API
  // API del backend local corre en 3000; en prod va bajo el mismo dominio
  apiUrl: isProduction ? `${baseUrl}/api` : 'http://localhost:3000/api',
  };
};

export default getConfig;