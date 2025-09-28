// Verificación completa OAuth FutPro.vip
// Ejecutar en consola del navegador en https://futpro.vip

console.log('🧪 VERIFICACIÓN OAUTH FUTPRO.VIP');
console.log('================================');

// 1. Verificar configuración de entorno
console.log('1. 🌍 Verificando entorno:');
console.log('   - Hostname:', window.location.hostname);
console.log('   - Protocol:', window.location.protocol);
console.log('   - URL completa:', window.location.href);

// 2. Verificar variables de Vite
console.log('2. ⚙️ Variables de entorno:');
const viteSupabaseUrl = import.meta?.env?.VITE_SUPABASE_URL;
const viteSupabaseKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY;
console.log('   - VITE_SUPABASE_URL:', viteSupabaseUrl);
console.log('   - VITE_SUPABASE_ANON_KEY:', viteSupabaseKey ? 'Configurada ✅' : 'NO encontrada ❌');

// 3. Verificar configuración dinámica
try {
  if (typeof getConfig === 'function') {
    const config = getConfig();
    console.log('3. 🔧 Configuración dinámica:');
    console.log('   - Base URL:', config.baseUrl);
    console.log('   - OAuth Callback:', config.oauthCallbackUrl);
    console.log('   - Es producción:', config.isProduction);
    console.log('   - Es Netlify:', config.isNetlify);
  } else {
    console.log('3. ❌ getConfig no disponible');
  }
} catch (error) {
  console.log('3. ❌ Error en configuración:', error.message);
}

// 4. Verificar Supabase client
try {
  if (typeof supabase !== 'undefined') {
    console.log('4. 📦 Supabase client:');
    console.log('   - Cliente inicializado ✅');
    console.log('   - URL:', supabase.supabaseUrl);
    console.log('   - Key:', supabase.supabaseKey ? 'Configurada ✅' : 'NO encontrada ❌');
  } else {
    console.log('4. ❌ Supabase client no disponible');
  }
} catch (error) {
  console.log('4. ❌ Error con Supabase:', error.message);
}

// 5. Test de OAuth buttons
console.log('5. 🔴 Test de botones OAuth:');
console.log('   Para probar OAuth, ve a la página de registro y verifica:');
console.log('   - Los botones de Google y Facebook aparecen');
console.log('   - Al hacer clic redirigen correctamente');
console.log('   - El callback funciona en /auth/callback');

// 6. Headers de seguridad
console.log('6. 🛡️ Verificando headers de seguridad:');
fetch(window.location.href, { method: 'HEAD' })
  .then(response => {
    console.log('   - X-Frame-Options:', response.headers.get('X-Frame-Options') || 'No configurado');
    console.log('   - X-Content-Type-Options:', response.headers.get('X-Content-Type-Options') || 'No configurado');
    console.log('   - Referrer-Policy:', response.headers.get('Referrer-Policy') || 'No configurado');
  })
  .catch(error => console.log('   - Error verificando headers:', error.message));

// 7. Test de rutas
console.log('7. 🗺️ Verificando rutas:');
const routesToTest = ['/auth/callback', '/home', '/dashboard', '/registro'];
routesToTest.forEach(route => {
  fetch(route, { method: 'HEAD' })
    .then(response => {
      console.log(`   - ${route}: ${response.status === 200 ? '✅' : '❌'} (${response.status})`);
    })
    .catch(error => {
      console.log(`   - ${route}: ❌ Error - ${error.message}`);
    });
});

console.log('');
console.log('🎯 ACCIONES REQUERIDAS SI HAY ERRORES:');
console.log('1. Verificar variables de entorno en Netlify Dashboard');
console.log('2. Confirmar URLs de callback en Supabase, Google y Facebook');
console.log('3. Verificar que _redirects y _headers estén en /dist');
console.log('4. Comprobar que el dominio futpro.vip esté correctamente configurado');
console.log('');
console.log('✅ Verificación completada. Revisa los resultados arriba.');

export default function verificarOAuthFutPro() {
  console.log('Verificación OAuth ejecutada. Ver resultados en consola.');
}