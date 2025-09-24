// Test en vivo de la conexión efectiva
console.log('🧪 INICIANDO TEST DE CONEXIÓN EFECTIVA...');

// Función de test que se ejecuta automáticamente
const testConexionEfectiva = async () => {
  try {
    console.log('📡 Importando conexión efectiva...');
    const { conexionEfectiva } = await import('../services/conexionEfectiva.js');
    
    console.log('🔍 Verificando conexión a Supabase...');
    const conexionOK = await conexionEfectiva.verificarConexion();
    
    if (conexionOK) {
      console.log('✅ CONEXIÓN EFECTIVA ESTABLECIDA');
      console.log('🎯 Sistema listo para OAuth real');
      
      // Mostrar URLs importantes
      console.log('🌐 URLs configuradas:');
      console.log('  - Aplicación: http://localhost:3000');
      console.log('  - Registro: http://localhost:3000/registro');
      console.log('  - Callback: http://localhost:3000/auth/callback');
      
      return true;
    } else {
      console.log('❌ ERROR EN CONEXIÓN EFECTIVA');
      return false;
    }
    
  } catch (error) {
    console.error('💥 ERROR EN TEST:', error);
    return false;
  }
};

// Ejecutar test en el navegador
if (typeof window !== 'undefined') {
  // Test automático al cargar
  testConexionEfectiva().then(exito => {
    if (exito) {
      console.log('🚀 SISTEMA LISTO PARA CONEXIÓN REAL');
    } else {
      console.log('⚠️ Revisar configuración');
    }
  });
  
  // Agregar función global para test manual
  window.testConexion = testConexionEfectiva;
  console.log('💡 Ejecuta "testConexion()" en la consola para test manual');
}

export { testConexionEfectiva };