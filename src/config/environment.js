// Configuración dinámica para producción
// Variables de configuración - compatibles con Jest y navegador
let SUPABASE_URL, SUPABASE_ANON_KEY, GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID;

// Acceso seguro a variables de Vite evitando el uso directo de import.meta (que rompe en Jest CommonJS)
// jest.setup.js define globalThis.import.meta.env para los tests
const viteEnv = (typeof globalThis !== 'undefined' && globalThis.import && globalThis.import.meta && globalThis.import.meta.env)
  ? globalThis.import.meta.env
  : undefined;

// En Jest/Node.js, usar process.env (definido en jest.setup.js)
if (typeof process !== 'undefined' && process.env) {
  SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
  GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
  FACEBOOK_CLIENT_ID = process.env.VITE_FACEBOOK_CLIENT_ID;
}

// En navegador (Vite) si viteEnv está disponible
if (viteEnv) {
  SUPABASE_URL = viteEnv.VITE_SUPABASE_URL;
  SUPABASE_ANON_KEY = viteEnv.VITE_SUPABASE_ANON_KEY;
  GOOGLE_CLIENT_ID = viteEnv.VITE_GOOGLE_CLIENT_ID;
  FACEBOOK_CLIENT_ID = viteEnv.VITE_FACEBOOK_CLIENT_ID;
}

export const getConfig = () => {
  // Detectar si estamos en Node.js (server-side). Jest a veces expone un window jsdom
  // aunque queremos tratar backend tests como entorno Node.
  const forcedNode = (typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID !== undefined);
  const isNode = forcedNode || typeof window === 'undefined';

  // Hostname robusto: siempre string. Evita TypeError en includes.
  const rawHostname = (!isNode && typeof window !== 'undefined' && window.location && typeof window.location.hostname === 'string')
    ? window.location.hostname
    : '';
  const safeHostname = String(rawHostname || '');
  const safeProtocol = (!isNode && typeof window !== 'undefined' && window.location && window.location.protocol) ? window.location.protocol : 'server';

  // Helper para includes seguro
  const has = (str, frag) => typeof str === 'string' && str.indexOf(frag) !== -1;

  // Producción si:
  // - Node con variables entorno de build
  // - Hostname de dominio principal / netlify
  const isProduction = isNode
    ? (process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true')
    : (safeHostname === 'futpro.vip' || has(safeHostname,'futpro.vip') || has(safeHostname,'netlify.app'));

  // Desarrollo si:
  const isDevelopment = isNode
    ? !isProduction
    : (safeHostname === 'localhost' || safeHostname === '127.0.0.1');

  const isNetlify = isNode
    ? (process.env.NETLIFY === 'true')
    : has(safeHostname,'netlify.app');

  console.log('🌍 Entorno detectado:', { 
    hostname: isNode ? 'server' : safeHostname, 
    isProduction, 
    isDevelopment,
    isNetlify,
    isNode,
    protocol: safeProtocol
  });

  // Determinar URL base correcta
  const baseUrl = isNode
    ? (isProduction ? 'https://futpro.vip' : 'http://localhost:5173')
    : (isProduction 
      ? (safeHostname === 'futpro.vip' ? 'https://futpro.vip' : (typeof window !== 'undefined' ? window.location.origin : 'https://futpro.vip'))
      : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'));

  return {
    // URLs base
    baseUrl,
    
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
    supabaseAnonKey: SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.F6GSIfkPgpgrcXkJU8b2PHhv-T5Lh36WSS2xdiuH-C8',
    
    // OAuth credentials - Compatible con Jest y navegador  
    googleClientId: GOOGLE_CLIENT_ID || '',
    facebookClientId: FACEBOOK_CLIENT_ID || '',
    
    // Flags de entorno
    isProduction,
    isDevelopment,
    isNetlify,
    isNode,
    autoConfirmSignup: (typeof process !== 'undefined' && process.env?.VITE_AUTO_CONFIRM_SIGNUP === 'true'),
    
    // Configuraciones de debug
    enableDebugLogs: isDevelopment,
    
    // URLs de API
  // API del backend local corre en 3000; en prod va bajo el mismo dominio
  apiUrl: isProduction ? `${baseUrl}/api` : 'http://localhost:3000/api',
  };
};

export default getConfig;