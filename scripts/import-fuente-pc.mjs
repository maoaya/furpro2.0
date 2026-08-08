#!/usr/bin/env node
/**
 * Importa el fuente del PC (Desktop/futpro2.0) a src-zona-pro/
 * para poder editar el producto real. NO usa el src de enero.
 *
 * Uso: node scripts/import-fuente-pc.mjs ruta/al/futpro2.0-fuente.zip
 *   o: node scripts/import-fuente-pc.mjs ruta/a/carpeta/futpro2.0
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

const root = process.cwd();
const dest = path.join(root, 'src-zona-pro');
const input = process.argv[2];

if (!input) {
  console.error(`Uso:
  node scripts/import-fuente-pc.mjs <zip-o-carpeta-del-PC>

Necesitas el FUENTE de Desktop\\\\futpro2.0 (con .jsx), no solo el deploy zip.`);
  process.exit(1);
}

const abs = path.resolve(input);
if (!fs.existsSync(abs)) {
  console.error('No existe:', abs);
  process.exit(1);
}

const keep = new Set(['README.md']);
for (const ent of fs.readdirSync(dest)) {
  if (keep.has(ent)) continue;
  fs.rmSync(path.join(dest, ent), { recursive: true, force: true });
}

function copyRecursive(src, d) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(d, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      if (name === 'node_modules' || name === '.git' || name === 'dist') continue;
      copyRecursive(path.join(src, name), path.join(d, name));
    }
  } else {
    fs.mkdirSync(path.dirname(d), { recursive: true });
    fs.copyFileSync(src, d);
  }
}

let sourceRoot = abs;
if (abs.endsWith('.zip')) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'zona-pro-src-'));
  execSync(`unzip -q -o ${JSON.stringify(abs)} -d ${JSON.stringify(tmp)}`, { stdio: 'inherit' });
  const kids = fs.readdirSync(tmp).filter((n) => !n.startsWith('__'));
  if (kids.length === 1 && fs.statSync(path.join(tmp, kids[0])).isDirectory()) {
    sourceRoot = path.join(tmp, kids[0]);
  } else {
    sourceRoot = tmp;
  }
}

// Detect if they uploaded dist-only by mistake
const hasJsx =
  fs.existsSync(path.join(sourceRoot, 'src')) &&
  fs.readdirSync(path.join(sourceRoot, 'src'), { recursive: true }).some((f) => String(f).endsWith('.jsx'));
const looksLikeDeployOnly =
  fs.existsSync(path.join(sourceRoot, 'index.html')) &&
  fs.existsSync(path.join(sourceRoot, 'assets')) &&
  !hasJsx;

if (looksLikeDeployOnly) {
  console.error(`❌ Esto parece solo el BUILD/deploy (como deploy-6a7256…), no el fuente.
Sube Desktop\\\\futpro2.0 completo (package.json + src con .jsx), no el zip de Netlify dist.`);
  process.exit(1);
}

copyRecursive(sourceRoot, dest);

const jsxCount = execSync(
  `find ${JSON.stringify(dest)} -name '*.jsx' | wc -l`,
  { encoding: 'utf8' }
).trim();

fs.writeFileSync(
  path.join(dest, 'IMPORT_META.txt'),
  `IMPORTED_FROM=${abs}
IMPORTED_AT=${new Date().toISOString()}
JSX_COUNT=${jsxCount}
PRODUCT_TARGET=producto-deploy (via build:zona-pro)
DO_NOT_USE=src/ enero / _legacy_archivo/src-ui-enero
`
);

console.log(`✅ Fuente importado en src-zona-pro/ (${jsxCount} archivos .jsx)`);
console.log('→ Edita ahí. Luego: npm run build:zona-pro && npm run check:producto && npm start');
console.log('→ UI en uso sigue siendo producto-deploy/ hasta que hagas build.');
