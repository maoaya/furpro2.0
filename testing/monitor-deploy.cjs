#!/usr/bin/env node
/**
 * 🔄 MONITOR DE DEPLOY EN TIEMPO REAL
 * Espera y valida automáticamente cada 30 segundos
 */

const { execSync } = require('child_process');

const MAX_ATTEMPTS = 10; // 5 minutos máximo (10 x 30s)
const INTERVAL = 30000; // 30 segundos
let attempt = 0;

console.log('🔄 Monitoreando deploy de Netlify...');
console.log('⏱️  Verificando cada 30 segundos (máximo 5 minutos)');
console.log('');

function checkDeploy() {
  attempt++;
  console.log(`📡 Intento ${attempt}/${MAX_ATTEMPTS} - ${new Date().toLocaleTimeString()}`);
  
  try {
    // Ejecutar validador
    const output = execSync('node testing/validate-deploy-auto.cjs', { encoding: 'utf-8' });
    
    // Buscar línea de éxito
    const successMatch = output.match(/🎯 Éxito: (\d+)%/);
    if (successMatch) {
      const percentage = parseInt(successMatch[1]);
      
      if (percentage >= 95) {
        console.log('');
        console.log('🎉 ¡DEPLOY COMPLETADO Y VALIDADO!');
        console.log(`✅ Éxito: ${percentage}%`);
        console.log('');
        console.log(output);
        process.exit(0);
      } else {
        console.log(`   Progreso: ${percentage}% (esperando >= 95%)`);
      }
    }
  } catch (error) {
    console.log('   ⏳ Aún procesando...');
  }
  
  if (attempt >= MAX_ATTEMPTS) {
    console.log('');
    console.log('⏰ Timeout: Deploy tomó más de 5 minutos');
    console.log('');
    console.log('Verifica manualmente en:');
    console.log('https://app.netlify.com/sites/futpro/deploys');
    console.log('');
    console.log('O ejecuta validación manual:');
    console.log('node testing/validate-deploy-auto.cjs');
    process.exit(1);
  }
  
  setTimeout(checkDeploy, INTERVAL);
}

// Esperar 1 minuto antes de la primera verificación
console.log('⏳ Esperando 60 segundos para que inicie el build...');
setTimeout(() => {
  console.log('');
  checkDeploy();
}, 60000);
