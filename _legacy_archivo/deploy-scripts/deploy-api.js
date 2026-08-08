#!/usr/bin/env node
// Deploy directo a Netlify usando la API REST
// Sube el contenido de dist/ como deploy de producción

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const NETLIFY_TOKEN = 'nfp_nnkufhSzUiUH8z5ZQpj1jzevhkaVeoeH8a75';
const SITE_ID = '74bcadc0-f0f4-493a-8bbb-d73ebed36e85';
const DIST_DIR = path.join(__dirname, 'dist');

console.log('🚀 FutPro 2.0 - Deploy via Netlify API\n');

// Verificar que dist existe
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ Error: directorio dist/ no existe');
  console.log('💡 Ejecuta: npm run build');
  process.exit(1);
}

// Función para hacer request a la API de Netlify
function netlifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.netlify.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '{}'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function triggerDeploy() {
  try {
    console.log('📡 Disparando build hook en Netlify...');
    
    // Opción 1: Trigger deploy via API
    const deploy = await netlifyRequest('POST', `/api/v1/sites/${SITE_ID}/deploys`, {
      branch: 'master',
      title: `Manual deploy - ${new Date().toISOString()}`
    });
    
    console.log('✅ Deploy iniciado exitosamente!');
    console.log(`📦 Deploy ID: ${deploy.id}`);
    console.log(`🔗 URL: ${deploy.deploy_ssl_url || deploy.url}`);
    console.log(`📊 Estado: ${deploy.state}`);
    console.log('\n🌐 Dashboard: https://app.netlify.com/sites/futprovip/deploys');
    console.log('⏱️  Espera 2-3 minutos para que el build se complete');
    
    return deploy;
  } catch (error) {
    console.error('❌ Error al disparar deploy:', error.message);
    
    // Fallback: intentar con build hook si existe
    console.log('\n💡 Intenta manualmente:');
    console.log('1. Ve a: https://app.netlify.com/sites/futprovip/deploys');
    console.log('2. Click en "Trigger deploy" → "Deploy site"');
    console.log('3. O arrastra la carpeta dist/ a la zona de drop');
    
    process.exit(1);
  }
}

// Ejecutar
triggerDeploy();
