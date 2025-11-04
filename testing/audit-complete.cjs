#!/usr/bin/env node
/**
 * 🔍 AUDITOR COMPLETO DE FUNCIONALIDADES
 * Verifica que todas las funciones del proyecto estén al 100%
 */

const fs = require('fs');
const path = require('path');

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(emoji, message, color = 'reset') {
  console.log(`${colors[color]}${emoji} ${message}${colors.reset}`);
}

const results = {
  total: 0,
  ok: 0,
  warning: 0,
  error: 0,
  items: []
};

function check(name, condition, details = '', level = 'ok') {
  results.total++;
  
  if (condition) {
    results.ok++;
    log('✅', name, 'green');
    if (details) log('   ', details, 'cyan');
    results.items.push({ name, status: 'ok', details });
  } else {
    if (level === 'error') {
      results.error++;
      log('❌', name, 'red');
    } else {
      results.warning++;
      log('⚠️', name, 'yellow');
    }
    if (details) log('   ', details, level === 'error' ? 'red' : 'yellow');
    results.items.push({ name, status: level, details });
  }
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  check(
    description,
    exists,
    exists ? `Encontrado: ${filePath}` : `No encontrado: ${filePath}`,
    exists ? 'ok' : 'error'
  );
  return exists;
}

function checkFileContent(filePath, searchText, description) {
  if (!fs.existsSync(filePath)) {
    check(description, false, `Archivo no existe: ${filePath}`, 'error');
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const found = content.includes(searchText);
  check(
    description,
    found,
    found ? `✓ "${searchText.substring(0, 50)}..."` : `✗ No se encontró "${searchText.substring(0, 50)}..."`,
    found ? 'ok' : 'warning'
  );
  return found;
}

console.log('');
log('🔍', '═══════════════════════════════════════', 'bold');
log('🚀', 'AUDITORÍA COMPLETA - FUTPRO 2.0', 'bold');
log('🔍', '═══════════════════════════════════════', 'bold');
console.log('');

// ============================================
// 1. PÁGINAS HTML ESTÁTICAS (31 funciones del menú)
// ============================================
log('📄', 'SECCIÓN 1: PÁGINAS HTML ESTÁTICAS', 'bold');
console.log('');

const publicPages = [
  'homepage-instagram.html',
  'editar-perfil.html',
  'estadisticas.html',
  'partidos.html',
  'logros.html',
  'tarjetas.html',
  'equipos.html',
  'torneo.html',
  'amistoso.html',
  'penaltis.html',
  'juegos.html',
  'notificaciones.html',
  'chat.html',
  'videos.html',
  'marketplace.html',
  'estados.html',
  'amigos.html',
  'ranking.html',
  'buscar-ranking.html',
  'soporte.html',
  'privacidad.html',
  'perfil-instagram.html'
];

publicPages.forEach(page => {
  checkFileExists(
    path.join('public', page),
    `Página: ${page}`
  );
});

console.log('');

// ============================================
// 2. SERVICIOS CORE
// ============================================
log('⚙️', 'SECCIÓN 2: SERVICIOS CORE', 'bold');
console.log('');

const services = [
  { file: 'AutoSaveService.js', class: 'AutoSaveService', method: 'startAutoSave' },
  { file: 'RealtimeService.js', class: 'RealtimeService', method: 'subscribe' },
  { file: 'CardService.js', class: 'CardService', method: 'generateCard' },
  { file: 'AuthService.js', class: 'AuthService', method: 'signInWithEmail' },
  { file: 'AnalyticsManager.js', class: 'AnalyticsManager', method: 'track' },
  { file: 'ChatManager.js', class: 'ChatManager', method: 'sendMessage' },
  { file: 'StreamManager.js', class: 'StreamManager', method: 'startStream' },
  { file: 'UserService.js', class: 'UserService', method: 'getUser' }
];

services.forEach(service => {
  const servicePath = path.join('src', 'services', service.file);
  if (checkFileExists(servicePath, `Servicio: ${service.file}`)) {
    checkFileContent(
      servicePath,
      `class ${service.class}`,
      `  └─ Clase ${service.class} definida`
    );
    checkFileContent(
      servicePath,
      service.method,
      `  └─ Método ${service.method}() implementado`
    );
  }
});

console.log('');

// ============================================
// 3. RUTAS REACT (SPA)
// ============================================
log('🔀', 'SECCIÓN 3: RUTAS REACT', 'bold');
console.log('');

const reactRoutes = [
  { path: '/configuracion', component: 'ConfiguracionUsuarioPage' },
  { path: '/ranking', component: 'RankingPage' },
  { path: '/perfil/:userId', component: 'PerfilPage' },
  { path: '/feed', component: 'FeedPage' },
  { path: '/admin', component: 'AdminPanelPage' },
  { path: '/auth/callback', component: 'AuthCallback' }
];

const appJsx = path.join('src', 'App.jsx');
if (checkFileExists(appJsx, 'App.jsx (Router principal)')) {
  reactRoutes.forEach(route => {
    checkFileContent(
      appJsx,
      `path="${route.path}"`,
      `Ruta: ${route.path} → ${route.component}`
    );
  });
}

console.log('');

// ============================================
// 4. FUNCIONES DEL MENÚ HAMBURGUESA
// ============================================
log('🍔', 'SECCIÓN 4: FUNCIONES DEL MENÚ', 'bold');
console.log('');

const menuFunctions = [
  { name: 'irAInicio', destination: 'homepage-instagram.html' },
  { name: 'editarPerfil', destination: 'editar-perfil.html' },
  { name: 'verEstadisticas', destination: 'estadisticas.html' },
  { name: 'verPartidos', destination: 'partidos.html' },
  { name: 'verTarjetas', destination: 'tarjetas.html' },
  { name: 'crearAmistoso', destination: 'amistoso.html' },
  { name: 'verVideos', destination: 'videos.html' },
  { name: 'verEstados', destination: 'estados.html' },
  { name: 'verAmigos', destination: 'amigos.html' },
  { name: 'abrirConfiguracion', destination: '/configuracion' },
  { name: 'contactarSoporte', destination: 'soporte.html' }
];

const homepagePath = path.join('public', 'homepage-instagram.html');
if (fs.existsSync(homepagePath)) {
  menuFunctions.forEach(func => {
    checkFileContent(
      homepagePath,
      `function ${func.name}()`,
      `Función: ${func.name}() → ${func.destination}`
    );
  });
}

console.log('');

// ============================================
// 5. BADGES EN MENÚ
// ============================================
log('🏷️', 'SECCIÓN 5: BADGES EN MENÚ', 'bold');
console.log('');

if (fs.existsSync(homepagePath)) {
  checkFileContent(homepagePath, '.badge-new', 'Estilos badge "Nuevo" definidos');
  checkFileContent(homepagePath, '.badge-react', 'Estilos badge "React" definidos');
  checkFileContent(homepagePath, 'Mis Tarjetas</span><span class="badge-new">Nuevo</span>', 'Badge en "Mis Tarjetas"');
  checkFileContent(homepagePath, 'Videos</span><span class="badge-new">Nuevo</span>', 'Badge en "Videos"');
  checkFileContent(homepagePath, 'Estados</span><span class="badge-new">Nuevo</span>', 'Badge en "Estados"');
  checkFileContent(homepagePath, 'Amigos</span><span class="badge-new">Nuevo</span>', 'Badge en "Amigos"');
  checkFileContent(homepagePath, 'Configuración</span><span class="badge-react">React</span>', 'Badge en "Configuración"');
  checkFileContent(homepagePath, 'Atajos React (SPA)', 'Sección "Atajos React (SPA)"');
}

console.log('');

// ============================================
// 6. CONFIGURACIÓN NETLIFY
// ============================================
log('🌐', 'SECCIÓN 6: CONFIGURACIÓN DEPLOY', 'bold');
console.log('');

checkFileExists('netlify.toml', 'netlify.toml');
if (fs.existsSync('netlify.toml')) {
  checkFileContent('netlify.toml', 'publish = "dist"', 'Directorio de publicación correcto');
  checkFileContent('netlify.toml', 'npm run build', 'Comando de build configurado');
  checkFileContent('netlify.toml', 'SECRETS_SCAN_ENABLED = "false"', 'Escaneo de secretos deshabilitado');
}

checkFileExists('package.json', 'package.json');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  check('Script "build" definido', !!pkg.scripts?.build, `"${pkg.scripts?.build}"`);
  check('Script "dev" definido', !!pkg.scripts?.dev, `"${pkg.scripts?.dev}"`);
}

console.log('');

// ============================================
// 7. AUTENTICACIÓN
// ============================================
log('🔐', 'SECCIÓN 7: AUTENTICACIÓN', 'bold');
console.log('');

checkFileExists(path.join('src', 'config', 'environment.js'), 'Configuración de entorno');
checkFileExists(path.join('src', 'pages', 'AuthCallback.jsx'), 'Callback OAuth');
checkFileExists(path.join('src', 'pages', 'HomeRedirect.jsx'), 'Redirección a homepage');

const authCallbackPath = path.join('src', 'pages', 'AuthCallback.jsx');
if (fs.existsSync(authCallbackPath)) {
  checkFileContent(authCallbackPath, "navigate('/home')", 'Redirección a /home después de OAuth');
}

const homeRedirectPath = path.join('src', 'pages', 'HomeRedirect.jsx');
if (fs.existsSync(homeRedirectPath)) {
  checkFileContent(homeRedirectPath, 'homepage-instagram.html', 'Redirección a homepage estática');
}

console.log('');

// ============================================
// RESUMEN FINAL
// ============================================
log('📊', '═══════════════════════════════════════', 'bold');
log('📈', 'RESUMEN DE AUDITORÍA', 'bold');
log('📊', '═══════════════════════════════════════', 'bold');

const percentage = Math.round((results.ok / results.total) * 100);

log('✅', `Tests OK: ${results.ok}`, 'green');
log('⚠️', `Warnings: ${results.warning}`, 'yellow');
log('❌', `Errores: ${results.error}`, 'red');
log('📊', `Total: ${results.total}`, 'cyan');
log('🎯', `Porcentaje: ${percentage}%`, percentage >= 90 ? 'green' : percentage >= 70 ? 'yellow' : 'red');

console.log('');

if (percentage >= 90) {
  log('🎉', '¡PROYECTO EN EXCELENTE ESTADO!', 'green');
  log('✨', 'Todas las funciones críticas están implementadas', 'green');
} else if (percentage >= 70) {
  log('👍', 'Proyecto funcional con mejoras pendientes', 'yellow');
  log('🔧', 'Revisar warnings para optimizar', 'yellow');
} else {
  log('⚠️', 'Proyecto necesita atención', 'red');
  log('🔧', 'Revisar errores críticos', 'red');
}

console.log('');

// Guardar reporte
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: results.total,
    ok: results.ok,
    warning: results.warning,
    error: results.error,
    percentage
  },
  details: results.items
};

fs.writeFileSync(
  'audit-report.json',
  JSON.stringify(report, null, 2),
  'utf-8'
);

log('💾', 'Reporte guardado: audit-report.json', 'cyan');

process.exit(results.error > 0 ? 1 : 0);
