// Script de diagnóstico para OAuth - ejecutar en consola del navegador en futpro.vip

console.log('🔍 DIAGNÓSTICO OAUTH FUTPRO.VIP');
console.log('==================================');

// 1. Verificar entorno
console.log('📍 ENTORNO:');
console.log('- URL actual:', window.location.href);
console.log('- Hostname:', window.location.hostname);
console.log('- Protocol:', window.location.protocol);
console.log('- Is production:', window.location.hostname === 'futpro.vip');

// 2. Verificar variables de entorno
console.log('\n🔧 VARIABLES DE ENTORNO:');
console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('- VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('- Todas las vars VITE_:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));

// 3. Verificar configuración de entorno
import { getConfig } from './src/config/environment.js';
const config = getConfig();
console.log('\n⚙️ CONFIGURACIÓN CALCULADA:');
console.log('- Base URL:', config.baseUrl);
console.log('- Callback URL:', config.oauthCallbackUrl);
console.log('- Is Production:', config.isProduction);

// 4. Test de Supabase
import supabase from './src/supabaseClient.js';
console.log('\n🗄️ SUPABASE CLIENT:');
console.log('- Supabase URL:', supabase.supabaseUrl);
console.log('- Supabase Key:', supabase.supabaseKey.substring(0, 20) + '...');

// 5. Test de OAuth (solo mostrar configuración, no ejecutar)
console.log('\n🔑 CONFIGURACIÓN OAUTH QUE SE ENVIARÍA:');
const oauthConfig = {
  provider: 'google',
  options: {
    redirectTo: config.oauthCallbackUrl,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  }
};
console.log('OAuth Config:', oauthConfig);

// 6. URLs que deben estar configuradas
console.log('\n📋 URLS QUE DEBEN ESTAR CONFIGURADAS:');
console.log('🔷 En Google Console (https://console.developers.google.com/apis/credentials):');
console.log('  - https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback');
console.log('  - https://futpro.vip/auth/callback');
console.log('  - https://futpro.vip');

console.log('\n🔷 En Supabase (https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration):');
console.log('  Site URL: https://futpro.vip');
console.log('  Redirect URLs: https://futpro.vip/auth/callback');

console.log('\n✅ Si todas las URLs están configuradas correctamente, OAuth debería funcionar.');
console.log('❌ Si hay error "Unable to exchange external code", revisar URLs de redirección.');