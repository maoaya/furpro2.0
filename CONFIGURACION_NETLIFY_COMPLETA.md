# 📋 CONFIGURACIÓN NETLIFY PARA FUTPRO.VIP

## 🔧 Configuración Build Settings

### Build Command:
```bash
npm run build
```

### Publish Directory:
```
dist
```

### Environment Variables (en Netlify Dashboard):
```
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.F6GSIfkPgpgrcXkJU8b2PHhv-T5Lh36WSS2xdiuH-C8
VITE_BASE_URL=https://futpro.vip
VITE_SERVER_URL=https://futpro.vip
VITE_OAUTH_CALLBACK_URL=https://futpro.vip/auth/callback
```

## 📁 Archivo _redirects (en carpeta public)

```
# SPA routing - todas las rutas van a index.html
/*    /index.html   200

# Auth callbacks específicos
/auth/callback    /index.html   200
/auth/callback-premium    /index.html   200

# API routes si las hay
/api/*    /api/:splat   200
```

## 🔐 Headers adicionales (archivo _headers en public)

```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/auth/*
  Cache-Control: no-cache

/api/*
  Access-Control-Allow-Origin: https://futpro.vip
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🚀 Deploy Hooks

### Webhook URL para despliegues automáticos:
- Se genera automáticamente al conectar con GitHub
- Cada push a `master` triggerea un nuevo deploy

## 📊 Verificación de Deploy

### Commands para verificar:
```bash
# Build local para testing
npm run build

# Preview local del build
npm run preview

# Verificar archivos generados
ls -la dist/
```

### URLs importantes:
- **Sitio principal**: https://futpro.vip
- **Admin dashboard**: https://app.netlify.com/sites/[site-name]
- **Deploy previews**: Se generan automáticamente

## 🔄 Proceso de Deploy Automático

1. **Commit** → Push a GitHub
2. **Webhook** → Netlify detecta cambios
3. **Build** → Ejecuta `npm run build`
4. **Deploy** → Sube archivos de `/dist`
5. **Live** → Cambios disponibles en futpro.vip

## 🧪 Testing Post-Deploy

### Script de verificación (ejecutar en consola de futpro.vip):
```javascript
// Verificar que el deploy fue exitoso
console.log('🔍 Verificando deploy...');
console.log('URL:', window.location.href);
console.log('Versión:', document.querySelector('meta[name="build-time"]')?.content || 'No definida');

// Test de componentes críticos
Promise.all([
  import('./src/pages/AuthHomePage.jsx'),
  import('./src/services/flujoCompletoRegistro.js'),
  import('./src/services/conexionEfectiva.js')
]).then(() => {
  console.log('✅ Todos los componentes cargados correctamente');
}).catch(e => {
  console.log('❌ Error cargando componentes:', e);
});
```

---
**🎯 CONFIGURACIÓN LISTA PARA PRODUCCIÓN EN FUTPRO.VIP**