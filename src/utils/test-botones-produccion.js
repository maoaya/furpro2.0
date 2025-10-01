// 🧪 TEST DE BOTONES OAUTH EN PRODUCCIÓN - futpro.vip
// Ejecutar en consola del navegador en futpro.vip

console.log('🚀 INICIANDO TEST DE BOTONES OAUTH EN FUTPRO.VIP');
console.log('================================================');

async function testearBotonesOAuth() {
  // Buscar botones OAuth
  const botones = Array.from(document.querySelectorAll('button'));
  const botonGoogle = botones.find(btn => btn.textContent.toLowerCase().includes('google'));
  const botonFacebook = botones.find(btn => btn.textContent.toLowerCase().includes('facebook'));
  
  console.log('🔍 BOTONES ENCONTRADOS:');
  console.log('- Google:', botonGoogle ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO');
  console.log('- Facebook:', botonFacebook ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO');
  
  if (!botonGoogle && !botonFacebook) {
    console.log('❌ NO SE ENCONTRARON BOTONES OAUTH');
    console.log('💡 Asegúrate de estar en la página de registro y que el perfil esté completo');
    return;
  }
  
  // Test directo de funciones
  console.log('🧪 PROBANDO FUNCIÓN DIRECTA DE OAUTH...');
  
  try {
    // Simular click en Google
    if (botonGoogle) {
      console.log('🔵 Simulando click en botón Google...');
      botonGoogle.click();
      
      // Esperar un momento para ver si hay respuesta
      setTimeout(() => {
        console.log('⏱️ Test de Google completado - revisa si hubo redirección');
      }, 2000);
    }
  } catch (error) {
    console.error('❌ Error en test de Google:', error);
  }
}

// Función para verificar el estado actual
function verificarEstadoActual() {
  console.log('🌍 VERIFICANDO ESTADO ACTUAL:');
  console.log('- URL actual:', window.location.href);
  console.log('- Hostname:', window.location.hostname);
  console.log('- Protocol:', window.location.protocol);
  
  // Verificar si hay errores en consola
  console.log('📝 ERRORES PENDIENTES:');
  console.log('Revisa si hay errores rojos arriba en la consola');
  
  // Verificar localStorage
  const perfilPendiente = localStorage.getItem('pendingProfileData');
  console.log('💾 Datos de perfil pendientes:', perfilPendiente ? '✅ EXISTEN' : '❌ NO EXISTEN');
  
  if (perfilPendiente) {
    try {
      const datos = JSON.parse(perfilPendiente);
      console.log('📋 Datos del perfil:', datos);
    } catch (e) {
      console.log('⚠️ Error parseando datos del perfil');
    }
  }
}

// Función para test manual de conexión
async function testManualConexion() {
  console.log('🔧 EJECUTANDO TEST MANUAL DE CONEXIÓN...');
  
  try {
    // Verificar si Supabase está disponible
    const supabaseUrl = 'https://TU_SUPABASE_URL.supabase.co'; // Simplificado para evitar errores
    const response = await fetch(supabaseUrl + '/rest/v1/', {
      method: 'HEAD'
    });
    
    console.log('🌐 Conexión a Supabase:', response.ok ? '✅ OK' : '❌ FALLO');
    
  } catch (error) {
    console.error('❌ Error conectando a Supabase:', error);
  }
}

// Ejecutar todos los tests
verificarEstadoActual();
testManualConexion();

// Dar tiempo antes de probar botones
setTimeout(() => {
  testearBotonesOAuth();
}, 1000);

console.log('================================================');
console.log('🎯 INSTRUCCIONES:');
console.log('1. Revisa los resultados arriba');
console.log('2. Si los botones no funcionan, verifica la configuración OAuth');
console.log('3. Asegúrate que Google/Facebook tengan futpro.vip configurado');
console.log('4. Si hay errores rojos, son la causa del problema');
console.log('================================================');