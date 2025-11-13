#!/usr/bin/env node
/**
 * Script de validación completa - FutPro 2.0
 * Ejecuta todas las validaciones críticas del flujo OAuth → Perfil → Card
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VALIDACIÓN COMPLETA FUTPRO 2.0\n');
console.log('=' .repeat(60));

const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper para ejecutar comandos
function runCommand(cmd, description) {
  console.log(`\n▶️  ${description}...`);
  try {
    const output = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 60000
    });
    console.log(`✅ ${description} - PASS`);
    results.passed.push(description);
    return { success: true, output };
  } catch (error) {
    console.log(`❌ ${description} - FAIL`);
    console.log(error.message);
    results.failed.push(description);
    return { success: false, error: error.message };
  }
}

// 1. Verificar estructura de archivos críticos
console.log('\n📁 Verificando archivos críticos...');
const criticalFiles = [
  'src/pages/FormularioRegistroCompleto.jsx',
  'src/pages/AuthCallback.jsx',
  'src/pages/PerfilCard.jsx',
  'src/pages/RegistroPerfil.jsx',
  'src/context/AuthContext.jsx',
  'babel.config.cjs',
  'package.json'
];

criticalFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} - Existe`);
    results.passed.push(`Archivo: ${file}`);
  } else {
    console.log(`❌ ${file} - NO ENCONTRADO`);
    results.failed.push(`Archivo: ${file}`);
  }
});

// 2. Build de Vite
runCommand('npm run build', 'Build de producción (Vite)');

// 3. Tests Backend
runCommand('npm run test:backend', 'Tests Backend');

// 4. Tests Frontend específicos
runCommand(
  'npx jest src/pages/__tests__/FormularioRegistroCompleto.oauth.test.jsx --config jest.frontend.config.cjs --passWithNoTests',
  'Test OAuth FormularioRegistroCompleto'
);

runCommand(
  'npx jest src/pages/__tests__/AuthCallback.oauth.test.jsx --config jest.frontend.config.cjs --passWithNoTests',
  'Test AuthCallback OAuth'
);

runCommand(
  'npx jest src/pages/__tests__/PerfilCard.test.jsx --config jest.frontend.config.cjs --passWithNoTests',
  'Test PerfilCard'
);

// 5. Validar configuración de Babel
console.log('\n🔧 Verificando configuración Babel...');
try {
  const babelConfigPath = path.join(__dirname, '..', 'babel.config.cjs');
  const babelConfigContent = fs.readFileSync(babelConfigPath, 'utf-8');
  if (babelConfigContent.includes('@babel/plugin-syntax-dynamic-import')) {
    console.log('✅ Plugin @babel/plugin-syntax-dynamic-import configurado');
    results.passed.push('Babel config: dynamic-import');
  } else {
    console.log('⚠️  Plugin @babel/plugin-syntax-dynamic-import NO encontrado');
    results.warnings.push('Babel config: falta dynamic-import');
  }
} catch (error) {
  console.log('❌ Error leyendo babel.config.cjs');
  results.failed.push('Babel config');
}

// 6. Validar rutas críticas en App.jsx
console.log('\n🗺️  Verificando rutas en App.jsx...');
try {
  const appContent = fs.readFileSync(path.join(__dirname, '..', 'src/App.jsx'), 'utf-8');
  const criticalRoutes = [
    '/formulario-registro',
    '/auth/callback',
    '/registro-perfil',
    '/perfil-card',
    '/seleccionar-categoria'
  ];
  
  criticalRoutes.forEach(route => {
    if (appContent.includes(route)) {
      console.log(`✅ Ruta ${route} - Configurada`);
      results.passed.push(`Ruta: ${route}`);
    } else {
      console.log(`❌ Ruta ${route} - NO ENCONTRADA`);
      results.failed.push(`Ruta: ${route}`);
    }
  });
} catch (error) {
  console.log('❌ Error leyendo App.jsx');
  results.failed.push('App.jsx');
}

// 7. Resumen final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VALIDACIÓN\n');
console.log(`✅ Pasaron: ${results.passed.length}`);
console.log(`❌ Fallaron: ${results.failed.length}`);
console.log(`⚠️  Advertencias: ${results.warnings.length}`);

if (results.failed.length > 0) {
  console.log('\n❌ FALLOS DETECTADOS:');
  results.failed.forEach(item => console.log(`   - ${item}`));
}

if (results.warnings.length > 0) {
  console.log('\n⚠️  ADVERTENCIAS:');
  results.warnings.forEach(item => console.log(`   - ${item}`));
}

console.log('\n' + '='.repeat(60));

// Exit code
process.exit(results.failed.length > 0 ? 1 : 0);
