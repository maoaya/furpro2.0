#!/usr/bin/env node
/**
 * Garantiza que la versión canónica Zona Pro (producto-deploy) esté presente
 * y que Netlify no vuelva a publicar el src de enero.
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const deployDir = path.join(root, 'producto-deploy');
const indexHtml = path.join(deployDir, 'index.html');
const netlifyToml = path.join(root, 'netlify.toml');

function fail(msg) {
  console.error('❌ PRODUCTO CANÓNICO:', msg);
  process.exit(1);
}

function ok(msg) {
  console.log('✅', msg);
}

if (!fs.existsSync(deployDir)) {
  fail('Falta carpeta producto-deploy/. Restaura el deploy Zona Pro.');
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

const assets = fs.existsSync(path.join(deployDir, 'assets'))
  ? fs.readdirSync(path.join(deployDir, 'assets'))
  : [];
const hasLogin = assets.some((f) => /loginpagesnew/i.test(f));
if (!hasLogin) {
  fail('No hay loginpagesnew en producto-deploy/assets/');
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

ok('producto-deploy presente (Zona Pro + loginpagesnew)');
ok('netlify.toml publica producto-deploy');
ok('candados anti-Vite/Instagram/dist OK');
console.log('→ Arranque: npm start  →  http://127.0.0.1:4173/');
console.log('→ Contexto: auditoria/AUDITORIA_CONTEXTO_PRODUCTO_ZONA_PRO.md');
