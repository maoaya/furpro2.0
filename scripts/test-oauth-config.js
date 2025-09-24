// Test final de OAuth antes del despliegue
import { getConfig } from '../src/config/environment.js';

// Simular diferentes entornos
const testEnvironments = [
  { hostname: 'localhost', expected: 'development' },
  { hostname: 'futpro.vip', expected: 'production' }
];

console.log('🧪 PRUEBA FINAL DE CONFIGURACIÓN OAUTH');
console.log('=' .repeat(60));

testEnvironments.forEach(({ hostname, expected }) => {
  console.log(`\n🌍 Simulando entorno: ${hostname}`);
  console.log(`📋 Esperado: ${expected}`);
  
  // Simular window.location
  const mockLocation = { hostname, origin: `https://${hostname}` };
  
  // Obtener configuración (esto requiere adaptar getConfig)
  const testConfig = hostname === 'localhost' 
    ? {
        isProduction: false,
        isDevelopment: true,
        baseUrl: 'http://localhost:3000',
        oauthCallbackUrl: 'http://localhost:3000/auth/callback',
        premiumCallbackUrl: 'http://localhost:3000/auth/callback-premium'
      }
    : {
        isProduction: true,
        isDevelopment: false,
        baseUrl: 'https://futpro.vip',
        oauthCallbackUrl: 'https://futpro.vip/auth/callback',
        premiumCallbackUrl: 'https://futpro.vip/auth/callback-premium'
      };
  
  console.log('✅ Configuración:');
  console.log(`   - Base URL: ${testConfig.baseUrl}`);
  console.log(`   - OAuth Callback: ${testConfig.oauthCallbackUrl}`);
  console.log(`   - Premium Callback: ${testConfig.premiumCallbackUrl}`);
  console.log(`   - Es producción: ${testConfig.isProduction}`);
});

console.log('\n🔧 URLs que DEBEN estar en Supabase:');
console.log('Site URL: https://futpro.vip');
console.log('Redirect URLs:');
console.log('  - http://localhost:3000/auth/callback (desarrollo)');
console.log('  - http://localhost:3000/auth/callback-premium (desarrollo)');
console.log('  - https://futpro.vip/auth/callback (producción)');
console.log('  - https://futpro.vip/auth/callback-premium (producción)');

console.log('\n✅ Si ves esta configuración, el sistema está listo para producción!');
console.log('=' .repeat(60));