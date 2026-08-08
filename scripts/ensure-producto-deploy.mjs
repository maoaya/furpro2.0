#!/usr/bin/env node
/**
 * Garantiza que la versión canónica Zona Pro (producto-deploy) esté presente,
 * coincida con el ZIP deploy-6a7256d5ffd58e44433d5158, y que Netlify no
 * vuelva a publicar el src de enero.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const deployDir = path.join(root, 'producto-deploy');
const indexHtml = path.join(deployDir, 'index.html');
const netlifyToml = path.join(root, 'netlify.toml');
const manifestPath = path.join(deployDir, 'MANIFEST_CANONICO.json');

/** Huellas del ZIP canónico (contenido idéntico; nombres con casing Linux). */
const CRITICAL_SHA256 = {
  'index.html': '0a1cad71024d3d9b8c7cab428167966807bbc8e62d56091485397224784dae32',
  'assets/index-DchpCYR3.js': '508808af5e8c5e2076f3c9c17ca77f385223df89332717091e3133a940e0aef2',
  'assets/loginpagesnew-BPP0r_st.js': '4f8edd111f98c04c8953b94ee165dfb8c4e95eaafac6c15249f48b67254bcf93',
  'assets/index-DoGwQ0mo.css': '72200c27e811051fd7851e4473dd3987d6655659870b47c993fad8955f66069e',
};

function fail(msg) {
  console.error('❌ PRODUCTO CANÓNICO:', msg);
  process.exit(1);
}

function ok(msg) {
  console.log('✅', msg);
}

function sha256File(filePath) {
  const h = crypto.createHash('sha256');
  h.update(fs.readFileSync(filePath));
  return h.digest('hex');
}

if (!fs.existsSync(deployDir)) {
  fail('Falta carpeta producto-deploy/. Restaura el ZIP deploy-6a7256d5ffd58e44433d5158.');
}

if (!fs.existsSync(indexHtml)) {
  fail('Falta producto-deploy/index.html');
}

const html = fs.readFileSync(indexHtml, 'utf8');
if (!/Zona Pro/i.test(html) && !/ZONA PRO/.test(html)) {
  fail('index.html no parece Zona Pro');
}
if (!/futpro-deploy/.test(html)) {
  fail('index.html sin meta futpro-deploy');
}
if (!/2026-08-04T21:16:30Z/.test(html)) {
  fail('meta futpro-deploy distinta del ZIP canónico (2026-08-04T21:16:30Z)');
}
if (!/index-DchpCYR3\.js/.test(html)) {
  fail('index.html no apunta al bundle canónico index-DchpCYR3.js');
}

const assetsDir = path.join(deployDir, 'assets');
const assets = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
const hasLogin = assets.some((f) => /loginpagesnew/i.test(f));
if (!hasLogin) {
  fail('No hay loginpagesnew en producto-deploy/assets/');
}
if (!assets.includes('loginpagesnew-BPP0r_st.js')) {
  fail('Falta assets/loginpagesnew-BPP0r_st.js (casing Linux del ZIP)');
}
if (!assets.includes('index-DchpCYR3.js')) {
  fail('Falta assets/index-DchpCYR3.js');
}

for (const [rel, expected] of Object.entries(CRITICAL_SHA256)) {
  const full = path.join(deployDir, rel);
  if (!fs.existsSync(full)) fail(`Falta archivo crítico ${rel}`);
  const got = sha256File(full);
  if (got !== expected) {
    fail(`Hash distinto en ${rel}. No es el ZIP canónico.\n  esperado=${expected}\n  actual  =${got}`);
  }
}
ok('hashes SHA256 del ZIP canónico OK (index + login + css + bundle)');

if (!fs.existsSync(manifestPath)) {
  fail('Falta producto-deploy/MANIFEST_CANONICO.json (inventario del ZIP)');
}

if (!fs.existsSync(netlifyToml)) {
  fail('Falta netlify.toml');
}
const toml = fs.readFileSync(netlifyToml, 'utf8');
if (!/publish\s*=\s*["']producto-deploy["']/.test(toml)) {
  fail('netlify.toml debe tener publish = "producto-deploy" (no dist/src enero)');
}
if (/command\s*=\s*["']npm run build["']/.test(toml)) {
  fail('netlify.toml no debe hacer npm run build del src viejo');
}
if (/C:\\\\Users\\\\lenovo/i.test(toml) || /C:\\Users\\lenovo/i.test(toml)) {
  fail('netlify.toml parece el del ZIP Windows (rutas absolutas). Usa el del repo.');
}

// Candados anti-reactivación
if (fs.existsSync(path.join(root, 'index.html')) && fs.existsSync(path.join(root, 'vite.config.js'))) {
  fail('Existen index.html + vite.config.js en la raíz (entrada Vite enero). Deben estar en _legacy_archivo/vite-entry/');
}
if (fs.existsSync(path.join(root, 'legacy-html-stubs'))) {
  fail('legacy-html-stubs/ volvió a la raíz (Instagram). Debe estar en _legacy_archivo/');
}
for (const bad of ['netlify-emergency.toml', 'netlify.deploy-local.toml']) {
  if (fs.existsSync(path.join(root, bad))) {
    fail(`${bad} en la raíz publica dist viejo. Muévelo a _legacy_archivo/netlify-alt/`);
  }
}


// Candado: la UI de enero no debe volver al árbol activo
for (const badUi of ['src/pages', 'src/components', 'src/App.jsx', 'src/main.jsx', 'src/index.jsx']) {
  if (fs.existsSync(path.join(root, badUi))) {
    fail(`${badUi} volvió al árbol activo (UI enero). Debe estar en _legacy_archivo/src-ui-enero/. Producto = producto-deploy/ (ZIP).`);
  }
}

ok('producto-deploy = ZIP deploy-6a7256d5ffd58e44433d5158 (Zona Pro)');
ok('netlify.toml publica producto-deploy');
ok('candados anti-Vite/Instagram/dist OK');
console.log('→ Arranque: npm start  →  http://127.0.0.1:4173/');
console.log('→ Contexto: auditoria/AUDITORIA_CONTEXTO_PRODUCTO_ZONA_PRO.md');
console.log('→ ZIP vinculado: auditoria/deploy-6a7256d5ffd58e44433d5158.zip');
