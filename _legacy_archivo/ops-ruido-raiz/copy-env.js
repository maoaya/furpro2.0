// Script para copiar .env.netlify a .env.production (multiplataforma)
import { existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = join(__dirname, '.env.netlify');
const dest = join(__dirname, '.env.production');

try {
  if (existsSync(source)) {
    copyFileSync(source, dest);
    console.log('✓ Copiado .env.netlify → .env.production');
  } else {
    console.log('⚠ .env.netlify no existe, usando .env por defecto');
  }
} catch (error) {
  console.error('Error copiando archivo:', error.message);
  process.exit(0); // No fallar el build por esto
}
