// Script de diagnóstico para verificar configuración OAuth
import { getConfig } from '../config/environment.js';

export const diagnosticarOAuth = () => {
  const config = getConfig();
  
  console.log('🔍 DIAGNÓSTICO DE OAUTH');
  console.log('='.repeat(50));
  
  console.log('📍 Ubicación actual:');
  console.log('- hostname:', window.location.hostname);
  console.log('- origin:', window.location.origin);
  console.log('- href:', window.location.href);
  
  console.log('\n🌍 Configuración detectada:');
  console.log('- Es producción:', config.isProduction);
  console.log('- Es desarrollo:', config.isDevelopment);
  console.log('- Base URL:', config.baseUrl);
  console.log('- OAuth callback:', config.oauthCallbackUrl);
  console.log('- Premium callback:', config.premiumCallbackUrl);
  
  console.log('\n🔑 Variables de entorno:');
  console.log('- VITE_SUPABASE_URL:', config.supabaseUrl);
  console.log('- VITE_SUPABASE_ANON_KEY:', config.supabaseKey ? '✅ Configurada' : '❌ No configurada');
  
  console.log('\n📱 URLs que se deben configurar en Supabase:');
  console.log('Para desarrollo:');
  console.log('- http://localhost:5174/auth/callback');
  console.log('- http://localhost:5173/auth/callback');
  console.log('- https://futpro.vip/auth/callback');
  console.log('Para producción:');
  console.log('- https://futpro.vip/auth/callback');
  console.log('- https://futpro.vip/auth/callback-premium');
  
  console.log('\n🎯 URL actual a usar:', config.oauthCallbackUrl);
  console.log('='.repeat(50));
  
  return config;
};

// Auto-ejecutar en desarrollo
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  diagnosticarOAuth();
}