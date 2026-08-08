#!/usr/bin/env node
/**
 * Sincroniza producto-deploy/ desde el ZIP canónico del PC,
 * corrigiendo casing de assets para Linux (index.html + imports del bundle).
 *
 * Uso:
 *   node scripts/sync-producto-from-zip.mjs [ruta-al.zip]
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';

const root = process.cwd();
const defaultZip = path.join(root, 'auditoria', 'deploy-6a7256d5ffd58e44433d5158.zip');
const zipPath = path.resolve(process.argv[2] || defaultZip);
const outDir = path.join(root, 'producto-deploy');

if (!fs.existsSync(zipPath)) {
  console.error('ZIP no encontrado:', zipPath);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'zona-pro-zip-'));
execSync(`unzip -o ${JSON.stringify(zipPath)} -d ${JSON.stringify(tmp)}`, { stdio: 'inherit' });

const htmlPath = path.join(tmp, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const caseNames = new Set();

for (const m of html.matchAll(/\/assets\/([A-Za-z0-9._-]+)/g)) {
  caseNames.add(m[1]);
}

const mainJs = [...caseNames].find((n) => /^index-.*\.js$/i.test(n));
if (mainJs) {
  const bundle = fs.readFileSync(path.join(tmp, 'assets', [...fs.readdirSync(path.join(tmp, 'assets'))].find((f) => f.toLowerCase() === mainJs.toLowerCase())), 'utf8');
  for (const m of bundle.matchAll(/assets\/([A-Za-z0-9._-]+\.(?:js|css|png|jpg|svg|webp))/g)) {
    caseNames.add(m[1]);
  }
  for (const m of bundle.matchAll(/["']\.\/([A-Za-z0-9._-]+\.(?:js|css))["']/g)) {
    caseNames.add(m[1]);
  }
}

const lowerToCanon = new Map();
for (const name of caseNames) {
  lowerToCanon.set(name.toLowerCase(), name);
}

// Prefer known mixed-case names from previous sync if present in MANIFEST
const manifestPath = path.join(outDir, 'MANIFEST_CANONICO.json');
if (fs.existsSync(manifestPath)) {
  try {
    const man = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const row of man.prod_case_map || []) {
      if (row.prod?.startsWith('assets/')) {
        const base = path.basename(row.prod);
        lowerToCanon.set(base.toLowerCase(), base);
      }
    }
  } catch {
    /* ignore */
  }
}

function rimraf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

const keep = new Set(['VERSION_LOCK.txt', 'README_PRODUCTO.txt', 'MANIFEST_CANONICO.json', 'SOURCE_ZIP.txt']);
for (const ent of fs.readdirSync(outDir)) {
  if (keep.has(ent)) continue;
  rimraf(path.join(outDir, ent));
}

function resolveAssetName(name) {
  return lowerToCanon.get(name.toLowerCase()) || name;
}

function walk(dir, rel = '') {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const from = path.join(dir, ent.name);
    const relPath = path.posix.join(rel.replace(/\\/g, '/'), ent.name);
    if (ent.isDirectory()) {
      walk(from, relPath);
      continue;
    }
    if (relPath === 'netlify.toml' || relPath === '__tmp_measure_home.js') {
      console.log('skip', relPath);
      continue;
    }
    let destRel = relPath;
    if (relPath.startsWith('assets/') && !relPath.includes('/sprites/')) {
      const base = path.basename(relPath);
      const canon = resolveAssetName(base);
      destRel = path.posix.join('assets', canon);
    } else if (relPath.startsWith('assets/sprites/')) {
      destRel = relPath; // sprites already lowercase ok
    }
    copyFile(from, path.join(outDir, destRel));
  }
}

walk(tmp);
rimraf(tmp);

fs.writeFileSync(
  path.join(outDir, 'SOURCE_ZIP.txt'),
  `ZIP=${path.basename(zipPath)}\nSYNC_AT=${new Date().toISOString()}\n`
);

console.log('Sync OK →', outDir);
console.log('Ejecuta: node scripts/ensure-producto-deploy.mjs');
