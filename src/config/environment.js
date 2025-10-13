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
  // Detectar si estamos en Node.js (server-side)
  const isNode = typeof window === 'undefined';
  
  // En Node.js, asumir desarrollo a menos que se especifique lo contrario
  const isProduction = isNode 
    ? (process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true')
    : (window.location.hostname === 'futpro.vip' || 
       window.location.hostname.includes('futpro.vip') ||
       window.location.hostname.includes('netlify.app'));
  
  const isDevelopment = isNode
    ? !isProduction
    : (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1');

  const isNetlify = isNode 
    ? (process.env.NETLIFY === 'true')
    : window.location.hostname.includes('netlify.app');

  console.log('🌍 Entorno detectado:', { 
    hostname: isNode ? 'server' : window.location.hostname, 
    isProduction, 
    isDevelopment,
    isNetlify,
    isNode,
    protocol: isNode ? 'server' : window.location.protocol
  });

  // 🔥 CONFIGURACIÓN HARDCODED PARA PRODUCCIÓN (fallback si env vars fallan)
  const PRODUCTION_CONFIG = {
    supabaseUrl: 'https://qqrxetxcglwrejtblwut.supabase.co',
    supabaseAnonKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5MTMyMTAsImV4cCI6MjA0MTQ4OTIxMH0.QG9rDBd7s7LgCUzNHVJEsqsXZPJNUhgUTW3zzC2o2ko',
    googleClientId: '760210878835-q5n5sms3gsr6rk8l2h2tffm2r8vm0dv8.apps.googleusercontent.com'
  };

  // Determinar URL base correcta
  const baseUrl = isNode
    ? (isProduction ? 'https://futpro.vip' : 'http://localhost:5173')
    : (isProduction 
      ? (window.location.hostname === 'futpro.vip' ? 'https://futpro.vip' : window.location.origin)
      : window.location.origin);

  return {
    // URLs base
    baseUrl,
    isProduction,
    isDevelopment,
    isNode,
    
    // URLs de callback para OAuth
    oauthCallbackUrl: `${baseUrl}/auth/callback`,
    
    // URLs específicas para home después del login (usar SIEMPRE el mismo origen del frontend)
    homeRedirectUrl: `${baseUrl}/home`,
    
    // URLs de callback premium (usar SIEMPRE el mismo origen del frontend)
    premiumCallbackUrl: `${baseUrl}/auth/callback-premium`,
    
    // 🔥 CONFIGURACIÓN DE TRACKING AUTOMÁTICO
    tracking: {
      enabled: true, // Siempre activo en producción
      autoSave: true, // Auto-guardado activado
      saveInterval: 3000, // 3 segundos como redes sociales
      batchSize: 10, // Máximo 10 acciones por batch
      maxRetries: 3, // Máximo 3 reintentos
      offlineStorage: true, // Guardar offline
      debugMode: isDevelopment // Debug solo en desarrollo
    },
    
    // Configuraciones de Supabase - Usar configuración hardcoded en producción
    supabaseUrl: isProduction ? PRODUCTION_CONFIG.supabaseUrl : (SUPABASE_URL || PRODUCTION_CONFIG.supabaseUrl),
    supabaseAnonKey: isProduction ? PRODUCTION_CONFIG.supabaseAnonKey : (SUPABASE_ANON_KEY || PRODUCTION_CONFIG.supabaseAnonKey),
    
    // OAuth credentials - Usar configuración hardcoded en producción
    googleClientId: isProduction ? PRODUCTION_CONFIG.googleClientId : (GOOGLE_CLIENT_ID || PRODUCTION_CONFIG.googleClientId),
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