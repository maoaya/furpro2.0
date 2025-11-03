// Copia todos los archivos .html desde public/ a dist/
// Útil porque Vite no siempre copia los .html en public/ durante el build.

import fs from 'fs';
import path from 'path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyHtmlFiles(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`[copy-public-htmls] public dir no existe: ${srcDir}`);
    return;
  }
  ensureDir(dstDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      // No copiamos subdirectorios aquí; se asume que Vite ya maneja assets/imagenes
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      fs.copyFileSync(srcPath, dstPath);
      count++;
    }
  }
  console.log(`[copy-public-htmls] Copiados ${count} archivos .html desde public/ a dist/`);
}

try {
  copyHtmlFiles(publicDir, distDir);
} catch (err) {
  console.error('[copy-public-htmls] Error copiando HTMLs:', err);
  process.exitCode = 1;
}
