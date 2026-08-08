import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

console.log('🚀 Iniciando deploy manual a Netlify...');

// Configuración
const NETLIFY_TOKEN = 'nfp_nnkufhSzUiUH8z5ZQpj1jzevhkaVeoeH8a75';
const SITE_ID = '74bcadc0-f0f4-493a-8bbb-d73ebed36e85';
const DIST_DIR = path.join(process.cwd(), 'dist');

// Crear archivo zip
console.log('📦 Creando archivo zip...');
try {
  execSync(`powershell -Command "Compress-Archive -Path '${DIST_DIR}' -DestinationPath dist.zip -Force"`, { stdio: 'inherit' });
  console.log('✅ Archivo zip creado');
} catch (error) {
  console.error('❌ Error creando zip:', error.message);
  process.exit(1);
}

// Verificar que el archivo existe
if (!fs.existsSync('dist.zip')) {
  console.error('❌ Archivo dist.zip no encontrado');
  process.exit(1);
}

console.log('📤 Subiendo a Netlify...');

// Leer el archivo zip
const zipData = fs.readFileSync('dist.zip');

// Hacer la petición POST a Netlify API
const options = {
  hostname: 'api.netlify.com',
  path: `/api/v1/sites/${SITE_ID}/deploys`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${NETLIFY_TOKEN}`,
    'Content-Type': 'application/zip',
    'Content-Length': zipData.length
  }
};

const req = https.request(options, (res) => {
  console.log(`📡 Status: ${res.statusCode}`);
  console.log(`📡 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ Deploy iniciado:', response);
      if (response.deploy_url) {
        console.log('🌐 URL del deploy:', response.deploy_url);
      }
    } catch (e) {
      console.log('📄 Respuesta:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error en la petición:', e.message);
});

req.write(zipData);
req.end();

console.log('🎯 Deploy enviado. Esperando respuesta...');