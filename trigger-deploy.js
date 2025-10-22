// ESM + Node 18+: usar fetch para llamar el Build Hook
// Este script fuerza un redeploy en Netlify usando un Build Hook

const SITE_NAME = 'futprovip';

// Modo 1: URL pasada como argumento (preferido)
// Modo 2: variable de entorno NETLIFY_BUILD_HOOK
const argUrl = process.argv[2];
const envUrl = process.env.NETLIFY_BUILD_HOOK;
const BUILD_HOOK_URL = argUrl || envUrl || '';

console.log('🚀 Forzando redeploy en Netlify...');
console.log('Sitio:', SITE_NAME);

if (!BUILD_HOOK_URL.startsWith('https://api.netlify.com/build_hooks/')) {
  console.error('❌ ERROR: Debes proporcionar la URL del Build Hook');
  console.error('   Ejemplo: node trigger-deploy.js https://api.netlify.com/build_hooks/XXXXXXXXXXXX');
  process.exit(1);
}

async function triggerBuild(url) {
  const res = await fetch(url, { method: 'POST' });
  return { status: res.status, text: await res.text() };
}

async function monitorOnce() {
  try {
    const res = await fetch('https://futpro.vip/index.html', { method: 'GET' });
    const html = await res.text();
    const timestamp = new Date().toLocaleTimeString('es-ES');
    if (html.includes('3795afd')) {
      console.log(`[${timestamp}] ✅ DEPLOY COMPLETADO - commit 3795afd detectado`);
      return true;
    }
    console.log(`[${timestamp}] ⏳ Esperando publicación (no se detecta commit nuevo aún)`);
    return false;
  } catch (e) {
    console.log('⚠️ Error al verificar publicación, reintentando...', e.message || e);
    return false;
  }
}

(async () => {
  try {
    console.log('📡 Enviando POST al Build Hook...');
    const resp = await triggerBuild(BUILD_HOOK_URL);
    if (resp.status >= 200 && resp.status < 300) {
      console.log(`✅ Build Hook aceptado (HTTP ${resp.status}).`);
      console.log('📊 Monitorea también aquí: https://app.netlify.com/sites/futprovip/deploys');
      // Monitoreo simple: 6 intentos cada 30s (3 minutos)
      for (let i = 0; i < 6; i++) {
        const ok = await monitorOnce();
        if (ok) {
          console.log('🎯 Prueba ahora el login con Google.');
          process.exit(0);
        }
        await new Promise(r => setTimeout(r, 30000));
      }
      console.log('⌛ El deploy puede tardar más. Revisa el dashboard de Netlify.');
      process.exit(0);
    } else {
      console.error(`❌ Netlify respondió con HTTP ${resp.status}`);
      console.error(resp.text);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error llamando al Build Hook:', err?.message || err);
    process.exit(1);
  }
})();
