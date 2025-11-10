// Script para copiar .env.netlify a .env.production (multiplataforma)
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '.env.netlify');
const dest = path.join(__dirname, '.env.production');

try {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log('✓ Copiado .env.netlify → .env.production');
  } else {
    console.log('⚠ .env.netlify no existe, usando .env por defecto');
  }
} catch (error) {
  console.error('Error copiando archivo:', error.message);
  process.exit(0); // No fallar el build por esto
}
