#!/usr/bin/env node
/**
 * 🤖 VALIDADOR AUTOMATIZADO DE DEPLOY - VERSIÓN SIMPLIFICADA
 * Verifica homepage y badges sin dependencias de Puppeteer
 */

const https = require('https');
const { URL } = require('url');

const PROD_URL = 'https://futpro.vip/homepage-instagram.html';
const TESTS = {
  passed: 0,
  failed: 0,
  results: []
};

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function test(name, result, details = '') {
  if (result) {
    TESTS.passed++;
    log('✅', `${name}`);
    if (details) log('   ', details);
  } else {
    TESTS.failed++;
    log('❌', `${name}`);
    if (details) log('   ', `ERROR: ${details}`);
  }
  TESTS.results.push({ name, result, details });
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function validateDeploy() {
  log('🚀', 'Iniciando validación automatizada de deploy...');
  log('🌐', `URL: ${PROD_URL}`);
  console.log('');

  try {
    // Test 1: Página accesible
    log('⏳', 'Descargando homepage-instagram.html...');
    const html = await fetchPage(PROD_URL);
    test('Página accesible (HTTP 200)', html.length > 0, `${Math.round(html.length/1024)}KB descargados`);

    // Test 2: Título correcto
    const hasTitle = html.includes('<title>FutPro - Home</title>');
    test('Título de página correcto', hasTitle);

    // Test 3: Badge "Nuevo" existe en CSS
    const hasBadgeNewCSS = html.includes('.badge-new') && html.includes('#00C853');
    test('Estilos de badge "Nuevo" definidos', hasBadgeNewCSS, 'background: #00C853');

    // Test 4: Badge "React" existe en CSS
    const hasBadgeReactCSS = html.includes('.badge-react') && html.includes('#61dafb');
    test('Estilos de badge "React" definidos', hasBadgeReactCSS, 'background: #61dafb');

    // Test 5: Badge en "Mis Tarjetas"
    const hasTarjetasBadge = html.includes('Mis Tarjetas</span><span class="badge-new">Nuevo</span>');
    test('Badge "Nuevo" en Mis Tarjetas', hasTarjetasBadge);

    // Test 6: Badge en "Crear Amistoso"
    const hasAmistosoBadge = html.includes('Crear Amistoso</span><span class="badge-new">Nuevo</span>');
    test('Badge "Nuevo" en Crear Amistoso', hasAmistosoBadge);

    // Test 7: Badge en "Videos"
    const hasVideosBadge = html.includes('Videos</span><span class="badge-new">Nuevo</span>');
    test('Badge "Nuevo" en Videos', hasVideosBadge);

    // Test 8: Badge en "Estados"
    const hasEstadosBadge = html.includes('Estados</span><span class="badge-new">Nuevo</span>');
    test('Badge "Nuevo" en Estados', hasEstadosBadge);

    // Test 9: Badge en "Amigos"
    const hasAmigosBadge = html.includes('Amigos</span><span class="badge-new">Nuevo</span>');
    test('Badge "Nuevo" en Amigos', hasAmigosBadge);

    // Test 10: Badge en "Soporte"
    const hasSoporteBadge = html.includes('Soporte</span><span class="badge-new">Nuevo</span>');
    test('Badge "Nuevo" en Soporte', hasSoporteBadge);

    // Test 11: Badge en "Configuración"
    const hasConfigBadge = html.includes('Configuración</span><span class="badge-react">React</span>');
    test('Badge "React" en Configuración', hasConfigBadge);

    // Test 12: Sección "Atajos React (SPA)"
    const hasReactSection = html.includes('Atajos React (SPA)');
    test('Sección "Atajos React (SPA)" existe', hasReactSection);

    // Test 13: Link directo /configuracion
    const hasConfigLink = html.includes('<a href="/configuracion" class="dropdown-item">') && 
                         html.includes('Ir a Configuración</span><span class="badge-react">React</span>');
    test('Link directo /configuracion en menú', hasConfigLink);

    // Test 14: Función abrirConfiguracion() actualizada
    const hasUpdatedFunction = html.includes("window.location.href = '/configuracion'");
    test('abrirConfiguracion() redirige a /configuracion', hasUpdatedFunction);

    // Test 15: Menú hamburguesa existe
    const hasHamburgerMenu = html.includes('toggleMenu()') && html.includes('dropdownMenu');
    test('Menú hamburguesa implementado', hasHamburgerMenu);

    // Test 16: Total de badges "Nuevo" = 6
    const nuevoBadgeCount = (html.match(/<span class="badge-new">Nuevo<\/span>/g) || []).length;
    test('Total badges "Nuevo" = 6', nuevoBadgeCount === 6, `Encontrados: ${nuevoBadgeCount}`);

    // Test 17: Total de badges "React" = 2
    const reactBadgeCount = (html.match(/<span class="badge-react">React<\/span>/g) || []).length;
    test('Total badges "React" = 2', reactBadgeCount === 2, `Encontrados: ${reactBadgeCount}`);

    // Test 18: Verificar items del menú
    const dropdownItems = (html.match(/class="dropdown-item"/g) || []).length;
    test('Menú tiene 30+ opciones', dropdownItems >= 30, `Total: ${dropdownItems} items`);

    // Test 19: Estilos modernos aplicados
    const hasModernStyles = html.includes('rgba(255, 215, 0') && html.includes('#FFD700');
    test('Estilos dorados (FutPro) aplicados', hasModernStyles);

    // Test 20: Auto-save system presente
    const hasAutoSave = html.includes('FutProAutoSave') || html.includes('futproAutoSave');
    test('Sistema de auto-guardado presente', hasAutoSave);

  } catch (error) {
    log('❌', `Error fatal: ${error.message}`);
    TESTS.failed++;
  }

  // Resumen final
  console.log('');
  log('📊', '═══════════════════════════════════════');
  log('📈', `RESUMEN DE VALIDACIÓN`);
  log('📊', '═══════════════════════════════════════');
  log('✅', `Tests pasados: ${TESTS.passed}`);
  log('❌', `Tests fallidos: ${TESTS.failed}`);
  log('📊', `Total: ${TESTS.passed + TESTS.failed}`);
  
  const percentage = Math.round((TESTS.passed / (TESTS.passed + TESTS.failed)) * 100);
  log('🎯', `Éxito: ${percentage}%`);
  
  if (TESTS.failed === 0) {
    console.log('');
    log('🎉', '¡DEPLOY VALIDADO EXITOSAMENTE!');
    log('🚀', 'Homepage con badges desplegada en producción');
  } else {
    console.log('');
    log('⚠️', 'Deploy con errores - revisar tests fallidos');
  }

  process.exit(TESTS.failed > 0 ? 1 : 0);
}

// Ejecutar validación
validateDeploy();
