const https = require('https');

// Este script fuerza un redeploy en Netlify usando un Build Hook
// Primero necesitamos crear el Build Hook desde el dashboard

const SITE_NAME = 'futprovip';
const BUILD_HOOK_URL = process.env.NETLIFY_BUILD_HOOK || 'https://api.netlify.com/build_hooks/YOUR_HOOK_ID';

console.log('🚀 Forzando redeploy en Netlify...');
console.log('Sitio:', SITE_NAME);

if (BUILD_HOOK_URL.includes('YOUR_HOOK_ID')) {
  console.error('❌ ERROR: Debes configurar el Build Hook primero');
  console.error('');
  console.error('Pasos:');
  console.error('1. Ve a: https://app.netlify.com/sites/futprovip/settings/deploys');
  console.error('2. Scroll a "Build hooks"');
  console.error('3. Click "Add build hook"');
  console.error('4. Nombre: "Auto Deploy", Branch: master');
  console.error('5. Copia la URL generada');
  console.error('6. Ejecuta: set NETLIFY_BUILD_HOOK=<URL_COPIADA> && node trigger-deploy.js');
  process.exit(1);
}

const url = new URL(BUILD_HOOK_URL);

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = https.request(options, (res) => {
  console.log('📡 Respuesta de Netlify:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Deploy disparado exitosamente!');
      console.log('⏳ El build tomará 2-3 minutos');
      console.log('📊 Monitorea en: https://app.netlify.com/sites/futprovip/deploys');
      
      // Iniciar monitoreo automático
      console.log('');
      console.log('🔍 Iniciando monitoreo automático...');
      setTimeout(startMonitoring, 30000); // Esperar 30s antes de empezar a verificar
    } else {
      console.error('❌ Error al disparar deploy:', res.statusCode);
      console.error(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error en la petición:', error.message);
});

req.end();

function startMonitoring() {
  const checkDeployment = () => {
    https.get('https://futpro.vip/index.html', (res) => {
      let html = '';
      
      res.on('data', (chunk) => {
        html += chunk;
      });
      
      res.on('end', () => {
        const timestamp = new Date().toLocaleTimeString('es-ES');
        
        if (html.includes('a993e4a') || html.includes('a009753')) {
          console.log(`[${timestamp}] ✅ DEPLOY COMPLETADO - Fix OAuth está LIVE!`);
          console.log('');
          console.log('🎯 Próximos pasos:');
          console.log('1. Abre incógnito: Ctrl + Shift + N');
          console.log('2. Ve a: https://futpro.vip');
          console.log('3. Limpia storage en consola:');
          console.log('   localStorage.clear(); sessionStorage.clear(); location.reload();');
          console.log('4. Click en "Continuar con Google"');
          console.log('5. Verifica que llegas a /home sin errores');
          process.exit(0);
        } else {
          console.log(`[${timestamp}] ⏳ Esperando... (aún en commit antiguo)`);
          setTimeout(checkDeployment, 30000); // Revisar cada 30s
        }
      });
    }).on('error', (err) => {
      console.error('Error verificando deployment:', err.message);
      setTimeout(checkDeployment, 30000);
    });
  };
  
  checkDeployment();
}
