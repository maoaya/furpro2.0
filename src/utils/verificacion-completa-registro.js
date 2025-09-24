// 🚀 VERIFICACIÓN COMPLETA DE REGISTRO EFECTIVO - futpro.vip
// Ejecutar en consola del navegador para verificar que todo funciona

console.log('🚀 INICIANDO VERIFICACIÓN COMPLETA DE REGISTRO EFECTIVO');
console.log('=========================================================');

async function verificacionCompleta() {
  
  // 1. Verificar entorno
  console.log('🌍 PASO 1: VERIFICANDO ENTORNO');
  console.log('- Dominio:', window.location.hostname);
  console.log('- URL completa:', window.location.href);
  console.log('- Es producción:', window.location.hostname.includes('futpro.vip'));

  // 2. Verificar conexión efectiva
  console.log('\n🔧 PASO 2: VERIFICANDO CONEXIÓN EFECTIVA');
  try {
    const { conexionEfectiva } = await import('./src/services/conexionEfectiva.js');
    console.log('✅ conexionEfectiva.js cargado correctamente');
    
    const conexion = await conexionEfectiva.verificarConexion();
    console.log('- Estado de conexión:', conexion ? '✅ ACTIVA' : '❌ INACTIVA');
    
  } catch (error) {
    console.error('❌ Error cargando conexionEfectiva:', error.message);
    return;
  }

  // 3. Verificar formulario de registro
  console.log('\n📝 PASO 3: VERIFICANDO FORMULARIO DE REGISTRO');
  
  // Buscar formulario
  const formulario = document.querySelector('form');
  console.log('- Formulario encontrado:', formulario ? '✅ SÍ' : '❌ NO');
  
  // Buscar botones OAuth
  const botones = Array.from(document.querySelectorAll('button'));
  const botonGoogle = botones.find(btn => btn.textContent.toLowerCase().includes('google'));
  const botonFacebook = botones.find(btn => btn.textContent.toLowerCase().includes('facebook'));
  
  console.log('- Botón Google:', botonGoogle ? '✅ VISIBLE' : '❌ NO VISIBLE');
  console.log('- Botón Facebook:', botonFacebook ? '✅ VISIBLE' : '❌ NO VISIBLE');
  
  if (botonGoogle) {
    console.log('  - Google habilitado:', !botonGoogle.disabled ? '✅ SÍ' : '❌ NO');
    console.log('  - Google tiene onClick:', botonGoogle.onclick ? '✅ SÍ' : '❌ NO');
  }
  
  if (botonFacebook) {
    console.log('  - Facebook habilitado:', !botonFacebook.disabled ? '✅ SÍ' : '❌ NO');
    console.log('  - Facebook tiene onClick:', botonFacebook.onclick ? '✅ SÍ' : '❌ NO');
  }

  // 4. Verificar datos pendientes
  console.log('\n💾 PASO 4: VERIFICANDO DATOS TEMPORALES');
  const perfilPendiente = localStorage.getItem('pendingProfileData');
  const progreso = localStorage.getItem('registroProgreso');
  const tempData = localStorage.getItem('tempRegistroData');
  
  console.log('- Perfil pendiente:', perfilPendiente ? '✅ EXISTE' : '❌ NO EXISTE');
  console.log('- Progreso guardado:', progreso ? '✅ EXISTE' : '❌ NO EXISTE');
  console.log('- Datos temporales:', tempData ? '✅ EXISTE' : '❌ NO EXISTE');
  
  if (perfilPendiente) {
    try {
      const datos = JSON.parse(perfilPendiente);
      console.log('  - Nombre en perfil:', datos.nombre || 'NO DEFINIDO');
      console.log('  - Email en perfil:', datos.email || 'NO DEFINIDO');
    } catch (e) {
      console.log('  - Error parseando perfil pendiente');
    }
  }

  // 5. Test de funcionalidad OAuth (simulado)
  console.log('\n🧪 PASO 5: TEST DE FUNCIONALIDAD OAUTH');
  
  try {
    const { conexionEfectiva } = await import('./src/services/conexionEfectiva.js');
    
    // Simular verificación sin hacer OAuth real
    console.log('- Función registrarConGoogle:', typeof conexionEfectiva.registrarConGoogle === 'function' ? '✅ DISPONIBLE' : '❌ NO DISPONIBLE');
    console.log('- Función registrarConFacebook:', typeof conexionEfectiva.registrarConFacebook === 'function' ? '✅ DISPONIBLE' : '❌ NO DISPONIBLE');
    console.log('- Función procesarCallback:', typeof conexionEfectiva.procesarCallback === 'function' ? '✅ DISPONIBLE' : '❌ NO DISPONIBLE');
    
  } catch (error) {
    console.error('❌ Error verificando funciones OAuth:', error.message);
  }

  // 6. Verificar estadísticas (si hay acceso)
  console.log('\n📊 PASO 6: VERIFICANDO ESTADÍSTICAS DE REGISTRO');
  
  try {
    const { conexionEfectiva } = await import('./src/services/conexionEfectiva.js');
    const stats = await conexionEfectiva.obtenerEstadisticasRegistro();
    
    if (stats.success) {
      console.log('✅ Base de datos accesible - Últimos registros:', stats.usuarios.length);
    } else {
      console.log('⚠️ No se pudieron obtener estadísticas (normal en algunos casos)');
    }
    
  } catch (error) {
    console.log('⚠️ Estadísticas no disponibles (normal en algunos casos)');
  }

  // Resumen final
  console.log('\n=========================================================');
  console.log('🎯 RESUMEN DE VERIFICACIÓN:');
  console.log('');
  console.log('✅ = Todo funciona correctamente');  
  console.log('❌ = Hay un problema que debe corregirse');
  console.log('⚠️ = Advertencia o información');
  console.log('');
  console.log('📋 PRÓXIMOS PASOS:');
  console.log('1. Si todo muestra ✅, prueba completar el registro');
  console.log('2. Si hay ❌, revisa los errores específicos');
  console.log('3. Completa el formulario y haz clic en Google/Facebook');
  console.log('4. El usuario debe guardarse permanentemente en la BD');
  console.log('=========================================================');
}

// Función para test rápido de botones
function testRapidoBotones() {
  console.log('\n🔄 TEST RÁPIDO DE BOTONES (sin OAuth real)');
  
  const botones = Array.from(document.querySelectorAll('button'));
  const botonGoogle = botones.find(btn => btn.textContent.toLowerCase().includes('google'));
  const botonFacebook = botones.find(btn => btn.textContent.toLowerCase().includes('facebook'));
  
  if (botonGoogle) {
    console.log('🔵 Simulando click en Google...');
    try {
      // Solo verificar que el botón responde, no hacer OAuth real
      const onclick = botonGoogle.onclick;
      if (onclick) {
        console.log('✅ Botón Google tiene funcionalidad');
      } else {
        console.log('❌ Botón Google no tiene funcionalidad');
      }
    } catch (e) {
      console.log('❌ Error en botón Google:', e.message);
    }
  }
  
  if (botonFacebook) {
    console.log('📘 Simulando click en Facebook...');
    try {
      const onclick = botonFacebook.onclick;
      if (onclick) {
        console.log('✅ Botón Facebook tiene funcionalidad');
      } else {
        console.log('❌ Botón Facebook no tiene funcionalidad');
      }
    } catch (e) {
      console.log('❌ Error en botón Facebook:', e.message);
    }
  }
}

// Ejecutar verificación completa
verificacionCompleta();

// Ofrecer test rápido adicional
console.log('\n💡 Para test rápido de botones, ejecuta: testRapidoBotones()');

// Hacer la función disponible globalmente
window.testRapidoBotones = testRapidoBotones;
window.verificacionCompleta = verificacionCompleta;