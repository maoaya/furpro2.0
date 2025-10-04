# FutPro 2.0 - Instrucciones para Agentes de IA

## 🏗 Arquitectura de la Aplicación

FutPro es una aplicación híbrida de gestión de fútbol que combina:
- **Frontend**: React + Vite (desarrollo) / Vanilla JS + HTML (páginas estáticas)
- **Backend**: Node.js/Express + funciones serverless Netlify
- **Bases de datos**: Supabase (principal) + Firebase (tiempo real)
- **Autenticación**: Doble sistema Supabase Auth + Firebase Auth

### Estructura Clave
```
src/
├── config/          # Configuración por entorno (environment.js es crítico)
├── services/        # Managers modulares (AuthService, ChatManager, etc.)
├── components/      # Componentes React reutilizables
├── pages/           # Páginas principales con routing
└── utils/           # Utilidades incluye diagnostico.js para OAuth

functions/          # Netlify serverless (signup-bypass.js, signin-proxy.js)
testing/           # Tests separados: backend vs frontend
```

## 🔄 Flujos de Desarrollo

### Comandos Principales
```bash
npm run dev         # Vite dev server (puerto 5173)
npm start          # Backend Express (puerto 8080) 
npm run build      # Build producción con Vite
npm test           # Tests completos con Jest
npm run deploy     # Deploy PowerShell automático
```

### Testing Específico
```bash
# Backend únicamente
npx jest -c jest.backend.config.cjs --runInBand testing/ping.test.js

# Frontend + integración
npx jest -c jest.frontend.config.cjs --runInBand

# E2E con Cypress
npx cypress open
```

## 🌐 Configuración Multi-Entorno

**Archivos de entorno por contexto:**
- `.env.example` - Plantilla con todas las variables
- `.env.netlify` - Variables públicas para despliegue
- `.env.production` - Configuración explícita de producción

**Detección automática en `src/config/environment.js`:**
```javascript
const isProduction = window.location.hostname === 'futpro.vip'
const oauthCallbackUrl = `${baseUrl}/auth/callback`
```

### Variables Críticas
```env
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  # Pública, safe para repo
VITE_GOOGLE_CLIENT_ID=760210878835-...  # Cliente OAuth oficial
```

## 🔐 Patrones de Autenticación

### Registro Anti-502 con Netlify Functions
- `functions/signup-bypass.js` - Bypass de CAPTCHA usando Service Role
- Fallback automático si signup directo falla
- Headers CORS configurados para producción

### OAuth Multi-Provider
```javascript
// AuthService.js patrón
async signInWithGoogle() {
  const config = getConfig()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: config.oauthCallbackUrl }
  })
}
```

## 🚀 Despliegue y Netlify

### Build Configuration (netlify.toml)
```toml
[build]
  command = "cp .env.netlify .env.production || cp .env.netlify .env; npm run build"
  publish = "dist"
  functions = "functions"

[build.environment]
  SECRETS_SCAN_ENABLED = "false"  # Evitar falsos positivos
  VITE_AUTO_CONFIRM_SIGNUP = "true"  # Anti-502
```

### Redirects para SPA
- `/auth/*` → `/index.html` (200)
- `/*` → `/index.html` (200, catch-all)

## 🧪 Testing Patterns

### Tests por Capas
- **Backend**: `testing/ping.test.js`, `testing/ranking-new.test.js`
- **Frontend**: `src/**/__tests__/*.test.jsx` con Jest + React Testing Library
- **Integración**: `RankingIntegration.test.jsx` levanta servidor real
- **E2E**: Cypress con login helpers

### Mocks Configurados
```javascript
// jest.setup.js - Mocks globales para Supabase, Firebase
jest.mock('@supabase/supabase-js', () => ({ /* mock */ }))
```

## 💾 Servicios y Managers

Arquitectura modular en `src/services/`:
- **AuthService.js** - Manejo completo de autenticación
- **ChatManager.js** - Chat tiempo real con Firebase
- **StreamManager.js** - Transmisiones WebRTC
- **AnalyticsManager.js** - Tracking de eventos
- **UserService.js** - CRUD usuarios con Supabase

### Patrón Común
```javascript
export class ServiceManager {
  constructor() { /* inicialización */ }
  async method() { /* lógica async con try/catch */ }
  handleError(error) { /* manejo consistente */ }
}
```

## ⚠️ Problemas Conocidos

1. **502 en registro** → Usar `functions/signup-bypass.js`
2. **OAuth redirect mismatch** → Verificar URLs en Supabase dashboard
3. **Secrets scan Netlify** → SECRETS_SCAN_ENABLED=false
4. **Tests parallel issues** → Usar `--runInBand` siempre

## 🎯 Próximos Pasos

Al modificar código:
1. Ejecutar tests correspondientes (`npm test` o específicos)
2. Verificar build con `npm run build`
3. Comprobar OAuth en desarrollo antes de deploy
4. Usar diagnósticos en `diagnostico.html` para validación