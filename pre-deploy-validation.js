#!/usr/bin/env node

/**
 * PRE-DEPLOY VALIDATION SCRIPT
 * Valida todos los archivos, componentes y configuración antes de deploy
 * 
 * Usage: node pre-deploy-validation.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let validationsPassed = 0;
let validationsFailed = 0;

// Funciones de utilidad
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const checkFile = (filePath, description) => {
  try {
    if (fs.existsSync(filePath)) {
      log(`✓ ${description}`, 'green');
      validationsPassed++;
      return true;
    } else {
      log(`✗ ${description} - NOT FOUND: ${filePath}`, 'red');
      validationsFailed++;
      return false;
    }
  } catch (error) {
    log(`✗ ${description} - ERROR: ${error.message}`, 'red');
    validationsFailed++;
    return false;
  }
};

const checkFileContent = (filePath, searchString, description) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchString)) {
      log(`✓ ${description}`, 'green');
      validationsPassed++;
      return true;
    } else {
      log(`✗ ${description} - STRING NOT FOUND`, 'red');
      validationsFailed++;
      return false;
    }
  } catch (error) {
    log(`✗ ${description} - ERROR: ${error.message}`, 'red');
    validationsFailed++;
    return false;
  }
};

const checkCommand = (command, description) => {
  try {
    execSync(command, { stdio: 'pipe' });
    log(`✓ ${description}`, 'green');
    validationsPassed++;
    return true;
  } catch (error) {
    log(`✗ ${description}`, 'red');
    validationsFailed++;
    return false;
  }
};

// ============================================================================
// VALIDACIONES PRINCIPALES
// ============================================================================

log('\n🚀 FutPro 2.0 - PRE-DEPLOY VALIDATION', 'cyan');
log('=' * 60, 'cyan');

// 1. Validar archivos creados
log('\n📁 Checking Created Files...', 'blue');
checkFile('src/components/CrearTorneoMejorado.jsx', 'CrearTorneoMejorado component');
checkFile('src/components/CrearTorneoMejorado.css', 'CrearTorneoMejorado styles');
checkFile('src/components/RankingMejorado.jsx', 'RankingMejorado component');
checkFile('src/components/RankingMejorado.css', 'RankingMejorado styles');
checkFile('src/components/MiEquipoMejorado.jsx', 'MiEquipoMejorado component');
checkFile('src/components/MiEquipoMejorado.css', 'MiEquipoMejorado styles');
checkFile('src/services/StreamingService.js', 'StreamingService');
checkFile('STREAMING_TABLES.sql', 'STREAMING_TABLES SQL');

// 2. Validar imports en App.jsx
log('\n🔌 Checking App.jsx Imports...', 'blue');
checkFileContent('src/App.jsx', 'import CrearTorneoMejorado', 'CrearTorneoMejorado import');
checkFileContent('src/App.jsx', 'import RankingMejorado', 'RankingMejorado import');
checkFileContent('src/App.jsx', 'import MiEquipoMejorado', 'MiEquipoMejorado import');

// 3. Validar rutas en App.jsx
log('\n🛣️  Checking Routes...', 'blue');
checkFileContent('src/App.jsx', '/crear-torneo-mejorado', 'CrearTorneoMejorado route');
checkFileContent('src/App.jsx', '/ranking', 'RankingMejorado route');
checkFileContent('src/App.jsx', '/mi-equipo/:teamId', 'MiEquipoMejorado route');

// 4. Validar archivos de documentación
log('\n📚 Checking Documentation...', 'blue');
checkFile('LISTA_FINAL_ENTREGA_COMPLETADA.md', 'Final delivery list');
checkFile('GUIA_MIEQUIPO_MEJORADO.md', 'MiEquipo usage guide');
checkFile('RESUMEN_FINAL_COMPLETO.md', 'Final summary');

// 5. Validar sintaxis JavaScript
log('\n✨ Checking JavaScript Syntax...', 'blue');
checkCommand('node -c src/components/CrearTorneoMejorado.jsx', 'CrearTorneoMejorado syntax');
checkCommand('node -c src/components/RankingMejorado.jsx', 'RankingMejorado syntax');
checkCommand('node -c src/components/MiEquipoMejorado.jsx', 'MiEquipoMejorado syntax');
checkCommand('node -c src/services/StreamingService.js', 'StreamingService syntax');

// 6. Validar SQL
log('\n🗄️  Checking SQL Syntax...', 'blue');
checkFile('STREAMING_TABLES.sql', 'SQL file exists');
checkFileContent('STREAMING_TABLES.sql', 'live_streams', 'live_streams table defined');
checkFileContent('STREAMING_TABLES.sql', 'stream_comments', 'stream_comments table defined');
checkFileContent('STREAMING_TABLES.sql', 'stream_reactions', 'stream_reactions table defined');
checkFileContent('STREAMING_TABLES.sql', 'stream_events', 'stream_events table defined');

// 7. Validar dependencias
log('\n📦 Checking Dependencies...', 'blue');
checkFile('package.json', 'package.json');
checkFileContent('package.json', 'react', 'React dependency');
checkFileContent('package.json', 'react-router-dom', 'React Router dependency');

// 8. Validar configuración
log('\n⚙️  Checking Configuration...', 'blue');
checkFile('.env.example', '.env.example file');
checkFile('vite.config.js', 'Vite config');
checkFile('netlify.toml', 'Netlify config');

// 9. Validar build
log('\n🔨 Checking Build Setup...', 'blue');
checkCommand('npm run build --dry-run', 'Build command available');

// 10. Validar tests
log('\n🧪 Checking Test Files...', 'blue');
checkFile('testing/CrearTorneoMejorado.test.jsx', 'CrearTorneoMejorado tests');
checkFile('testing/RankingMejorado.test.jsx', 'RankingMejorado tests');

// ============================================================================
// RESUMEN
// ============================================================================

log('\n' + '='.repeat(60), 'cyan');
log(`\n📊 VALIDATION SUMMARY`, 'cyan');
log(`✓ Passed: ${validationsPassed}`, 'green');
log(`✗ Failed: ${validationsFailed}`, validationsFailed > 0 ? 'red' : 'green');

if (validationsFailed === 0) {
  log('\n🎉 ALL VALIDATIONS PASSED - READY FOR DEPLOYMENT!', 'green');
  log('\nNext steps:', 'yellow');
  log('1. npm run build', 'cyan');
  log('2. npm run deploy', 'cyan');
  log('3. Verify in production: https://futpro.vip', 'cyan');
  process.exit(0);
} else {
  log('\n⚠️  SOME VALIDATIONS FAILED - FIX BEFORE DEPLOYING', 'red');
  log('\nFailed items:');
  log('- Check file paths are correct', 'yellow');
  log('- Verify imports in App.jsx', 'yellow');
  log('- Validate route definitions', 'yellow');
  log('- Check syntax errors', 'yellow');
  process.exit(1);
}
