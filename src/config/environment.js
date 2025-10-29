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


// En navegador (Vite), usar window.VITE_* si existe
if (typeof window !== 'undefined') {
  SUPABASE_URL = window.VITE_SUPABASE_URL || SUPABASE_URL;
  SUPABASE_ANON_KEY = window.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;
  GOOGLE_CLIENT_ID = window.VITE_GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID;
  FACEBOOK_CLIENT_ID = window.VITE_FACEBOOK_CLIENT_ID || FACEBOOK_CLIENT_ID;
}

const getConfig = () => {
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

// Exportación dual: CommonJS (Node/Jest) y ESM (Vite/frontend)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getConfig };
}
export default getConfig;