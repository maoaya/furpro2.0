// 📊 VERIFICADOR DE DESPLIEGUE NETLIFY - futpro.vip
// Ejecutar en consola del navegador después de 5 minutos

console.log('🔍 VERIFICANDO DESPLIEGUE DE NETLIFY EN FUTPRO.VIP');
console.log('================================================');

// 1. Verificar información de despliegue
console.log('📅 Información de Sesión:');
console.log('- Timestamp:', new Date().toISOString());
console.log('- URL actual:', window.location.href);
console.log('- User Agent:', navigator.userAgent.split(' ')[0]);

// 2. Verificar archivos críticos
async function verificarArchivos() {
  console.log('📦 VERIFICANDO ARCHIVOS DESPLEGADOS...');
  
  const archivos = [
    '/src/services/conexionEfectiva.js',
    '/src/pages/RegistroPage.jsx',
    '/src/components/AuthCallback.jsx'
  ];
  
  for (const archivo of archivos) {
    try {
      const response = await fetch(archivo);
      console.log(`- ${archivo}:`, response.ok ? '✅ DISPONIBLE' : '❌ NO ENCONTRADO');
    } catch (e) {
      console.log(`- ${archivo}: ❌ ERROR - ${e.message}`);
    }
  }
}

// 3. Verificar módulos ES6
async function verificarModulos() {
  console.log('🔧 VERIFICANDO MÓDULOS ES6...');
  
  try {
    const modulo = await import('./src/services/conexionEfectiva.js');
    console.log('✅ conexionEfectiva.js importado correctamente');
    
    if (modulo.conexionEfectiva) {
      console.log('✅ Objeto conexionEfectiva disponible');
      console.log('- Funciones disponibles:', Object.keys(modulo.conexionEfectiva));
    } else {
      console.log('❌ Objeto conexionEfectiva no encontrado');
    }
    
  } catch (error) {
    console.log('❌ Error importando módulo:', error.message);
    console.log('💡 Puede que el despliegue aún no esté completo');
  }
}

// 4. Verificar estado de los botones
function verificarBotones() {
  console.log('🖱️ VERIFICANDO BOTONES OAUTH...');
  
  const botones = Array.from(document.querySelectorAll('button'));
  const botonGoogle = botones.find(btn => btn.textContent.toLowerCase().includes('google'));
  const botonFacebook = botones.find(btn => btn.textContent.toLowerCase().includes('facebook'));
  
  console.log('- Botón Google:', botonGoogle ? '✅ ENCONTRADO' : '❌ NO VISIBLE');
  console.log('- Botón Facebook:', botonFacebook ? '✅ ENCONTRADO' : '❌ NO VISIBLE');
  
  if (botonGoogle) {
    console.log('- Google onClick:', botonGoogle.onclick ? '✅ TIENE EVENTO' : '❌ SIN EVENTO');
  }
  
  if (botonFacebook) {
    console.log('- Facebook onClick:', botonFacebook.onclick ? '✅ TIENE EVENTO' : '❌ SIN EVENTO');
  }
}

// 5. Test de funcionalidad
async function testFuncionalidad() {
  console.log('🧪 PROBANDO FUNCIONALIDAD OAUTH...');
  
  try {
    const { conexionEfectiva } = await import('./src/services/conexionEfectiva.js');
    
    // Test de verificación (no hace OAuth real)
    const verificacion = await conexionEfectiva.verificarConexion(); 
    console.log('✅ Test de verificación:', verificacion ? 'EXITOSO' : 'FALLÓ');
    
  } catch (error) {
    console.log('❌ Error en test de funcionalidad:', error.message);
  }
}

// Ejecutar todas las verificaciones
async function ejecutarVerificacion() {
  await verificarArchivos();
  await verificarModulos();
  verificarBotones();
  await testFuncionalidad();
  
  console.log('================================================');
  console.log('🎯 RESULTADO DEL DIAGNÓSTICO:');
  console.log('');
  console.log('Si todos los elementos muestran ✅, el despliegue fue exitoso.');
  console.log('Si hay ❌, espera 2-3 minutos más y ejecuta de nuevo.');
  console.log('');
  console.log('Para ejecutar de nuevo: location.reload() y volver a pegar este script');
  console.log('================================================');
}

// Ejecutar diagnóstico
ejecutarVerificacion();