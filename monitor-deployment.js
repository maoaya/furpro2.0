// Monitor deployment - busca commits 3795afd o 7057d2f en producción
const TARGET_COMMITS = ['3795afd', '7057d2f'];
const CHECK_INTERVAL = 30000; // 30 segundos
const MAX_CHECKS = 10; // 5 minutos máximo

async function checkDeployment(attempt = 1) {
  try {
    console.log(`\n[${new Date().toLocaleTimeString()}] 🔍 Verificando deployment (intento ${attempt}/${MAX_CHECKS})...`);
    
    const res = await fetch('https://futpro.vip/index.html', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    const html = await res.text();
    
    // Buscar cualquiera de los commits objetivo
    const foundCommit = TARGET_COMMITS.find(commit => html.includes(commit));
    
    if (foundCommit) {
      console.log(`\n✅✅✅ DEPLOY COMPLETADO ✅✅✅`);
      console.log(`Commit detectado: ${foundCommit}`);
      console.log(`\n🎯 PRÓXIMOS PASOS:\n`);
      console.log('1. Abre ventana de incógnito: Ctrl + Shift + N');
      console.log('2. Ve a: https://futpro.vip');
      console.log('3. Abre consola (F12) y ejecuta:');
      console.log('   localStorage.clear(); sessionStorage.clear(); location.reload();');
      console.log('4. Click en "Continuar con Google"');
      console.log('5. Verifica que:');
      console.log('   - ✅ NO aparece error "Unable to exchange external code"');
      console.log('   - ✅ Navegas automáticamente a /home');
      console.log('   - ✅ Ves tu dashboard con tu perfil');
      console.log('\n📊 Si aún falla, copia TODOS los logs de la consola y pásalos.\n');
      process.exit(0);
    } else {
      console.log(`⏳ Esperando... (aún no se detecta el nuevo commit)`);
      
      if (attempt >= MAX_CHECKS) {
        console.log(`\n⌛ Timeout: Se alcanzó el máximo de intentos (${MAX_CHECKS})`);
        console.log(`\n💡 Revisa manualmente el estado del deploy en:`);
        console.log(`   https://app.netlify.com/sites/futprovip/deploys`);
        console.log(`\n   Cuando esté "Published", prueba el OAuth en incógnito.\n`);
        process.exit(1);
      }
      
      setTimeout(() => checkDeployment(attempt + 1), CHECK_INTERVAL);
    }
  } catch (err) {
    console.error(`❌ Error verificando deployment:`, err.message);
    
    if (attempt >= MAX_CHECKS) {
      console.log(`\n⌛ Se alcanzó el máximo de intentos.\n`);
      process.exit(1);
    }
    
    setTimeout(() => checkDeployment(attempt + 1), CHECK_INTERVAL);
  }
}

console.log('🚀 Iniciando monitoreo de deployment...');
console.log(`Buscando commits: ${TARGET_COMMITS.join(', ')}`);
console.log(`Intervalo: ${CHECK_INTERVAL / 1000} segundos`);
console.log(`Máximo tiempo: ${(MAX_CHECKS * CHECK_INTERVAL) / 60000} minutos\n`);

checkDeployment();
