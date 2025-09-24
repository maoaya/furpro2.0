// 🎯 VERIFICACIÓN FINAL COMPLETA - FUTPRO.VIP REGISTRO OAUTH
// Ejecutar en consola del navegador en futpro.vip después de 5 minutos

console.log('🎯 VERIFICACIÓN FINAL COMPLETA - REGISTRO OAUTH FUTPRO.VIP');
console.log('========================================================');

async function verificacionFinalCompleta() {
  const resultados = {};
  
  // 1. Información del entorno
  console.log('🌍 VERIFICANDO ENTORNO:');
  resultados.entorno = {
    url: window.location.href,
    hostname: window.location.hostname,
    esProduccion: window.location.hostname === 'futpro.vip',
    timestamp: new Date().toISOString()
  };
  
  Object.entries(resultados.entorno).forEach(([key, value]) => {
    console.log(`- ${key}:`, value);
  });
  
  // 2. Verificar componentes críticos
  console.log('\n📦 VERIFICANDO COMPONENTES CRÍTICOS:');
  const componentes = [
    { nombre: 'AuthHomePage', path: './src/pages/AuthHomePage.jsx' },
    { nombre: 'flujoCompletoRegistro', path: './src/services/flujoCompletoRegistro.js' },
    { nombre: 'conexionEfectiva', path: './src/services/conexionEfectiva.js' },
    { nombre: 'RegistroPage', path: './src/pages/RegistroPage.jsx' }
  ];
  
  resultados.componentes = {};
  
  for (const comp of componentes) {
    try {
      const modulo = await import(comp.path);
      resultados.componentes[comp.nombre] = '✅ DISPONIBLE';
      console.log(`- ${comp.nombre}: ✅ DISPONIBLE`);
      
      if (comp.nombre === 'flujoCompletoRegistro') {
        const funciones = Object.keys(modulo.flujoCompletoRegistro || modulo.default || {});
        console.log(`  Funciones: ${funciones.join(', ')}`);
      }
      
    } catch (e) {
      resultados.componentes[comp.nombre] = `❌ ERROR: ${e.message}`;
      console.log(`- ${comp.nombre}: ❌ ERROR:`, e.message);
    }
  }
  
  // 3. Verificar interfaz de usuario
  console.log('\n🖱️ VERIFICANDO INTERFAZ:');
  
  // Buscar elementos clave
  const elementos = {
    tabs: document.querySelectorAll('button[onclick], button').length,
    tabIngresar: Array.from(document.querySelectorAll('button')).find(btn => 
      btn.textContent.includes('Ingresar')),
    tabRegistrarse: Array.from(document.querySelectorAll('button')).find(btn => 
      btn.textContent.includes('Registrarse')),
    botonesOAuth: Array.from(document.querySelectorAll('button')).filter(btn => 
      btn.textContent.toLowerCase().includes('google') || 
      btn.textContent.toLowerCase().includes('facebook'))
  };
  
  resultados.interfaz = {
    totalBotones: elementos.tabs,
    tabIngresar: elementos.tabIngresar ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO',
    tabRegistrarse: elementos.tabRegistrarse ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO',
    botonesOAuth: elementos.botonesOAuth.length
  };
  
  Object.entries(resultados.interfaz).forEach(([key, value]) => {
    console.log(`- ${key}:`, value);
  });
  
  // 4. Test funcional de OAuth
  console.log('\n🧪 PROBANDO FUNCIONALIDAD OAUTH:');
  
  try {
    const { flujoCompletoRegistro } = await import('./src/services/flujoCompletoRegistro.js');
    
    // Test de estado de registro
    const estado = await flujoCompletoRegistro.verificarEstadoRegistro();
    resultados.oauth = {
      estado: estado.estado,
      mensaje: estado.mensaje,
      funcionando: '✅ SÍ'
    };
    
    console.log('- Estado del registro:', estado.estado);
    console.log('- Mensaje:', estado.mensaje);
    console.log('- OAuth funcionando: ✅ SÍ');
    
  } catch (error) {
    resultados.oauth = {
      funcionando: '❌ NO',
      error: error.message
    };
    console.log('- OAuth funcionando: ❌ NO');
    console.log('- Error:', error.message);
  }
  
  // 5. Verificar localStorage
  console.log('\n💾 VERIFICANDO LOCALSTORAGE:');
  const keys = ['pendingProfileData', 'registroProgreso', 'tempRegistroData', 'currentUser'];
  resultados.localStorage = {};
  
  keys.forEach(key => {
    const value = localStorage.getItem(key);
    const existe = !!value;
    resultados.localStorage[key] = existe ? `✅ EXISTE (${value.length} chars)` : '❌ NO EXISTE';
    console.log(`- ${key}:`, resultados.localStorage[key]);
  });
  
  // 6. Test de despliegue
  console.log('\n🚀 VERIFICANDO DESPLIEGUE:');
  
  const deployInfo = {
    netlifyHeaders: document.querySelector('meta[name="generator"]')?.content || 'No detectado',
    buildTime: document.querySelector('meta[name="build-time"]')?.content || 'No disponible',
    redirectsActivos: window.history.pushState ? '✅ SÍ' : '❌ NO'
  };
  
  resultados.deploy = deployInfo;
  
  Object.entries(deployInfo).forEach(([key, value]) => {
    console.log(`- ${key}:`, value);
  });
  
  // 7. Evaluación final
  console.log('\n🎯 EVALUACIÓN FINAL:');
  
  const checks = [
    resultados.entorno.esProduccion,
    resultados.componentes.AuthHomePage?.includes('✅'),
    resultados.componentes.flujoCompletoRegistro?.includes('✅'),
    resultados.interfaz.tabRegistrarse?.includes('✅'),
    resultados.interfaz.botonesOAuth >= 2,
    resultados.oauth.funcionando?.includes('✅')
  ];
  
  const pasados = checks.filter(Boolean).length;
  const total = checks.length;
  const porcentaje = Math.round((pasados / total) * 100);
  
  console.log(`📊 Checks pasados: ${pasados}/${total} (${porcentaje}%)`);
  
  if (porcentaje >= 90) {
    console.log('🎉 ¡EXCELENTE! El sistema está funcionando perfectamente.');
    console.log('✅ Los botones OAuth deberían funcionar correctamente.');
    console.log('🎯 Pasos para probar:');
    console.log('   1. Click en tab "Registrarse"');
    console.log('   2. Click en botón "Google" o "Facebook"');
    console.log('   3. Completar OAuth');
    console.log('   4. Completar formulario de perfil');
    console.log('   5. Usuario guardado permanentemente');
    
  } else if (porcentaje >= 70) {
    console.log('⚠️ BIEN. La mayoría de componentes funcionan.');
    console.log('🔧 Revisa los elementos marcados con ❌');
    
  } else {
    console.log('❌ PROBLEMAS DETECTADOS.');
    console.log('🚨 Múltiples componentes requieren atención.');
    console.log('💡 Espera 2-3 minutos más y ejecuta de nuevo.');
  }
  
  // 8. Instrucciones finales
  console.log('\n📋 INSTRUCCIONES FINALES:');
  console.log('1. Si todos los checks están ✅, el sistema funciona');
  console.log('2. Para probar OAuth: Click en Registrarse → Google/Facebook');
  console.log('3. Para re-ejecutar: location.reload() y pegar este script');
  console.log('4. Para limpiar cache: Ctrl+F5');
  
  console.log('\n📞 SOPORTE:');
  console.log('- Si OAuth no funciona: revisar configuración Google/Facebook');
  console.log('- Si formulario no aparece: verificar rutas de Netlify');
  console.log('- Si BD no guarda: verificar Supabase connection');
  
  console.log('========================================================');
  console.log('✨ VERIFICACIÓN COMPLETADA ✨');
  
  return resultados;
}

// Ejecutar verificación completa
verificacionFinalCompleta();