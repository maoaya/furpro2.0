# 🚀 NETLIFY DEPLOYMENT MAP - FUTPRO 2.0
## Mapa Completo de Archivos, Rutas y Funcionalidad

**Fecha:** 3 de noviembre de 2025  
**Build Command:** `npm ci && npm run build`  
**Publish Directory:** `dist/`  
**Functions Directory:** `functions/`

---

## 📂 ESTRUCTURA DE DESPLIEGUE

### 1️⃣ ARCHIVOS ESTÁTICOS (public/ → dist/)

#### **A) Páginas HTML Principales** (15 archivos)
| Archivo | Ruta Netlify | Función | Estado |
|---------|--------------|---------|--------|
| `public/homepage-instagram.html` | `/homepage-instagram.html` | Homepage principal post-login (Instagram-style feed) | ✅ ACTIVO |
| `public/videos.html` | `/videos.html` | Página de videos TikTok-style + transmisiones en vivo | ✅ NUEVO |
| `public/chat.html` | `/chat.html` | Chat en tiempo real con Firebase | ✅ ACTIVO |
| `public/marketplace.html` | `/marketplace.html` | Marketplace de productos y servicios | ✅ ACTIVO |
| `public/ranking.html` | `/ranking.html` | Rankings de jugadores y partidos | ✅ ACTIVO |
| `public/logros.html` | `/logros.html` | Sistema de logros y achievements | ✅ ACTIVO |
| `public/juegos.html` | `/juegos.html` | Centro de juegos (penaltis, cards, etc.) | ✅ ACTIVO |
| `public/penaltis.html` | `/penaltis.html` | Juego de penaltis | ✅ ACTIVO |
| `public/perfil-instagram.html` | `/perfil-instagram.html` | Perfil de usuario estilo Instagram | ✅ ACTIVO |
| `public/diagnostico-oauth-live.html` | `/diagnostico-oauth-live.html` | Diagnóstico de OAuth en producción | ⚙️ UTILIDAD |
| `public/validador-web.html` | `/validador-web.html` | Validador de configuración web | ⚙️ UTILIDAD |
| `public/offline.html` | `/offline.html` | Página offline para PWA | ✅ ACTIVO |
| `public/manifest.json` | `/manifest.json` | Manifest PWA | ✅ ACTIVO |
| `public/sw.js` | `/sw.js` | Service Worker | ✅ ACTIVO |

#### **B) Configuración Netlify**
| Archivo | Función | Estado |
|---------|---------|--------|
| `public/_headers` | Headers de seguridad y cache | ✅ ACTIVO |
| `public/_redirects` | Redirects adicionales | ✅ ACTIVO |
| `netlify.toml` | Configuración principal de build | ✅ ACTIVO |

---

### 2️⃣ APLICACIÓN REACT (src/ → dist/index.html + assets/)

#### **A) Punto de Entrada**
| Archivo | Build Output | Función |
|---------|--------------|---------|
| `index.html` | `dist/index.html` | SPA principal - Vite entry point |
| `src/main.jsx` | `dist/assets/main-[hash].js` | Bootstrap React + AuthProvider |
| `src/App.jsx` | `dist/assets/App-[hash].js` | Router principal + Layout |

#### **B) Rutas React Router** (23 rutas configuradas)

##### **🔐 Rutas de Autenticación (SIN Layout)**
| Ruta | Componente | Archivo | Función |
|------|-----------|---------|---------|
| `/` | `LoginRegisterForm` | `src/pages/LoginRegisterForm.jsx` | Landing page con login |
| `/login` | `AuthPageUnificada` | `src/pages/AuthPageUnificada.jsx` | Login unificado OAuth + Email |
| `/registro` | `AuthPageUnificada` | `src/pages/AuthPageUnificada.jsx` | Registro unificado |
| `/registro-nuevo` | `RegistroNuevo` | `src/pages/RegistroNuevo.jsx` | Registro multi-paso con tracking |
| `/registro-google` | `AuthPageUnificada` | `src/pages/AuthPageUnificada.jsx` | Registro vía Google |
| `/registro-facebook` | `AuthPageUnificada` | `src/pages/AuthPageUnificada.jsx` | Registro vía Facebook |
| `/registro-email` | `AuthPageUnificada` | `src/pages/AuthPageUnificada.jsx` | Registro con email/password |
| `/auth` | `AuthPageUnificada` | `src/pages/AuthPageUnificada.jsx` | Auth genérico |
| `/auth/callback` | `AuthCallback` | `src/pages/AuthCallback.jsx` | Callback OAuth (Google/Facebook) |

##### **🏠 Rutas Principales (CON Layout - Sidebar + BottomNav)**
| Ruta | Componente | Archivo | Función |
|------|-----------|---------|---------|
| `/home` | `HomeRedirect` | `src/pages/HomeRedirect.jsx` | Redirect a homepage-instagram.html |
| `/feed` | `FeedPage` | `src/pages/FeedPage.jsx` | Feed de posts |
| `/perfil/:userId` | `PerfilPage` | `src/pages/PerfilPage.jsx` | Perfil dinámico usuario |
| `/notificaciones` | `NotificationsPage` | `src/pages/NotificationsPage.jsx` | Centro de notificaciones |
| `/admin` | `AdminPanelPage` | `src/pages/AdminPanelPage.jsx` | Panel admin (roles) |
| `/equipo/:id` | `EquipoDetallePage` | `src/pages/EquipoDetallePage.jsx` | Detalle de equipo |
| `/torneo/:id` | `TorneoDetallePage` | `src/pages/TorneoDetallePage.jsx` | Detalle de torneo |
| `/usuario/:id` | `UsuarioDetallePage` | `src/pages/UsuarioDetallePage.jsx` | Usuario detallado |
| `/ranking` | `RankingPage` | `src/pages/RankingPage.jsx` | Rankings React |
| `/progreso` | `ProgresoPage` | `src/pages/ProgresoPage.jsx` | Progreso de jugador |
| `/penaltis` | `PenaltisPage` | `src/pages/PenaltisPage.jsx` | Penaltis React |
| `/historial-penaltis` | `HistorialPenaltisPage` | `src/pages/HistorialPenaltisPage.jsx` | Historial de penaltis |
| `/ayuda` | `AyudaFAQPage` | `src/pages/AyudaFAQPage.jsx` | FAQ y ayuda |
| `/configuracion` | `ConfiguracionUsuarioPage` | `src/pages/ConfiguracionUsuarioPage.jsx` | Configuración usuario |
| `/compartir` | `CompartirContenidoPage` | `src/pages/CompartirContenidoPage.jsx` | Compartir contenido |
| `/chat-sql` | `ChatSQLPage` | `src/pages/ChatSQLPage.jsx` | Chat con SQL |
| `/marketplace` | `MarketplacePage` | `src/pages/MarketplacePage.jsx` | Marketplace React |
| `/logros` | `LogrosPage` | `src/pages/LogrosPage.jsx` | Logros React |
| `/estadisticas-avanzadas` | `EstadisticasAvanzadasPage` | `src/pages/EstadisticasAvanzadasPage.jsx` | Stats avanzadas |
| `/comparativas` | `ComparativasPage` | `src/pages/ComparativasPage.jsx` | Comparativas jugadores |
| `/*` | `NotFoundPage` | `src/pages/NotFoundPage.jsx` | 404 personalizado |

---

### 3️⃣ NETLIFY SERVERLESS FUNCTIONS (functions/)

| Función | Endpoint | Archivo | Función | Estado |
|---------|----------|---------|---------|--------|
| `signup-bypass` | `/.netlify/functions/signup-bypass` | `functions/signup-bypass.js` | Registro sin CAPTCHA usando Service Role | ✅ ACTIVO |
| `signin-proxy` | `/.netlify/functions/signin-proxy` | `functions/signin-proxy.js` | Login server-side (anti-502) | ✅ ACTIVO |
| `signup-proxy` | `/.netlify/functions/signup-proxy` | `functions/signup-proxy.js` | Registro server-side | ✅ ACTIVO |
| `auto-confirm` | `/.netlify/functions/auto-confirm` | `functions/auto-confirm.js` | Auto-confirmación usuarios | ✅ ACTIVO |
| `test` | `/.netlify/functions/test` | `functions/test.js` | Test endpoint | ⚙️ UTILIDAD |

---

### 4️⃣ SERVICIOS CORE (src/services/)

| Servicio | Archivo | Función | Estado |
|----------|---------|---------|--------|
| **AutoSaveService** | `src/services/AutoSaveService.js` | Guardado automático 3s con cola batch | ✅ ACTIVADO |
| **RealtimeService** | `src/services/RealtimeService.js` | Supabase Realtime (chat, notif, presence) | ✅ ACTIVADO |
| **CardService** | `src/services/CardService.js` | Generación tarjetas FIFA con stats | ✅ ACTIVADO |
| **ChatManager** | `src/services/ChatManager.js` | Gestión chat Firebase | ✅ ACTIVO |
| **StreamManager** | `src/services/StreamManager.js` | WebRTC transmisiones | ✅ ACTIVO |
| **AnalyticsManager** | `src/services/AnalyticsManager.js` | Tracking eventos | ✅ ACTIVO |
| **UserService** | `src/services/UserService.js` | CRUD usuarios Supabase | ✅ ACTIVO |
| **TeamManager** | `src/services/TeamManager.js` | Gestión equipos | ✅ ACTIVO |
| **TournamentManager** | `src/services/TournamentManager.js` | Gestión torneos | ✅ ACTIVO |
| **PartidoManager** | `src/services/PartidoManager.js` | Gestión partidos | ✅ ACTIVO |

---

### 5️⃣ CONFIGURACIÓN Y CONTEXTO (src/config/ + src/context/)

| Archivo | Función | Estado |
|---------|---------|--------|
| `src/config/environment.js` | Config única (URLs, OAuth, tracking, Supabase) | ✅ CRÍTICO |
| `src/supabaseClient.js` | Cliente Supabase unificado con PKCE | ✅ CRÍTICO |
| `src/context/AuthContext.jsx` | Provider de autenticación global | ✅ CRÍTICO |
| `src/utils/authFlowManager.js` | Orquestador post-login (navegación, perfil) | ✅ CRÍTICO |

---

## 🔄 REDIRECTS NETLIFY (netlify.toml)

### Redirects configurados:
```toml
# OAuth y Auth
/auth/*           → /index.html (200 SPA)
/oauth/*          → /index.html (200 SPA)
/registro*        → /index.html (200 SPA)

# API Functions
/api/*            → /.netlify/functions/:splat (200)

# Catch-all SPA
/*                → /index.html (200)
```

**Efecto:** Todas las rutas React funcionan con refresh directo (SPA routing).

---

## 🌐 FLUJO COMPLETO DE NAVEGACIÓN

### **Escenario 1: Usuario Nuevo**
```
1. https://futpro.vip/ 
   → LoginRegisterForm.jsx

2. Click "Registrarse con Google"
   → AuthPageUnificada.jsx → Supabase OAuth

3. Google redirige a:
   → https://futpro.vip/auth/callback?code=...
   → AuthCallback.jsx

4. AuthCallback crea perfil en `usuarios`:
   → authFlowManager.handlePostLoginFlow()

5. Redirección final:
   → https://futpro.vip/homepage-instagram.html
   (HTML estático con menu hamburguesa)
```

### **Escenario 2: Usuario Existente**
```
1. https://futpro.vip/
   → LoginRegisterForm.jsx

2. Email/Password login
   → AuthPageUnificada.jsx → supabase.auth.signInWithPassword()

3. AuthContext detecta sesión:
   → Carga perfil desde `usuarios` tabla

4. Redirección:
   → https://futpro.vip/homepage-instagram.html
```

### **Escenario 3: Navegación Post-Login**
```
Usuario en homepage-instagram.html:

1. Click menú hamburguesa → "Videos"
   → window.location.href = '/videos.html'
   → https://futpro.vip/videos.html (TikTok-style)

2. Click "Ranking"
   → window.location.href = '/ranking.html'
   → https://futpro.vip/ranking.html

3. Click "Chat"
   → window.location.href = '/chat.html'
   → https://futpro.vip/chat.html

4. Click "Marketplace"
   → window.location.href = '/marketplace.html'
   → https://futpro.vip/marketplace.html

5. Click "Configuración"
   → window.location.href = '/configuracion'
   → https://futpro.vip/configuracion (React SPA)
   → ConfiguracionUsuarioPage.jsx
```

---

## 📊 ARQUITECTURA DE DATOS

### **Supabase Tables (Backend)**
| Tabla | Uso | Acceso |
|-------|-----|--------|
| `usuarios` | Perfiles de usuario | RLS habilitado |
| `partidos` | Historial de partidos | RLS habilitado |
| `equipos` | Equipos de fútbol | RLS habilitado |
| `torneos` | Torneos activos | RLS habilitado |
| `tarjetas_fifa` | Cards generadas | RLS habilitado |
| `mensajes` | Chat messages | RLS habilitado |
| `notificaciones` | Sistema de notificaciones | RLS habilitado |
| `transmisiones` | Live streams | RLS habilitado |

### **Firebase (Realtime)**
- **Chat:** `chats/{roomId}/messages`
- **Presence:** `presence/{userId}`
- **Live Streams:** `streams/{streamId}`

### **LocalStorage (Frontend)**
- `futpro_user`: Usuario actual
- `futpro_session`: Sesión Supabase
- `futpro_autosave_*`: Colas auto-save
- `futpro_historial_completo`: Historial eventos (5000 max)
- `futpro_cards`: Tarjetas FIFA (100 max)
- `futpro_stats`: Estadísticas locales

---

## 🔐 VARIABLES DE ENTORNO (Netlify Settings)

### **Variables Públicas (VITE_*)**
```env
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (público, safe)
VITE_GOOGLE_CLIENT_ID=760210878835-...
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_PROJECT_ID=futpro-...
VITE_FIREBASE_APP_ID=1:760210878835:web:...
VITE_AUTO_CONFIRM_SIGNUP=true
VITE_PRODUCTION_MODE=true
VITE_TRACKING_ENABLED=true
VITE_AUTO_SAVE_ENABLED=true
```

### **Variables Secretas (Solo Functions)**
```env
SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (SECRETO)
```

**⚠️ IMPORTANTE:** 
- Configurar en Netlify: Site settings > Build & deploy > Environment variables
- NUNCA en código o .env públicos

---

## 🎯 VALIDACIÓN DE RUTAS (Checklist)

### **✅ Rutas HTML Estáticas**
- [ ] `/` → LoginRegisterForm
- [ ] `/homepage-instagram.html` → Homepage principal
- [ ] `/videos.html` → Videos TikTok + Live
- [ ] `/chat.html` → Chat Firebase
- [ ] `/marketplace.html` → Marketplace
- [ ] `/ranking.html` → Rankings
- [ ] `/logros.html` → Logros
- [ ] `/juegos.html` → Centro juegos
- [ ] `/penaltis.html` → Juego penaltis
- [ ] `/perfil-instagram.html` → Perfil usuario

### **✅ Rutas React SPA**
- [ ] `/login` → AuthPageUnificada
- [ ] `/registro` → AuthPageUnificada
- [ ] `/registro-nuevo` → RegistroNuevo (multi-paso)
- [ ] `/auth/callback` → OAuth callback
- [ ] `/feed` → Feed posts
- [ ] `/perfil/:userId` → Perfil dinámico
- [ ] `/configuracion` → Config usuario
- [ ] `/admin` → Panel admin
- [ ] `/equipo/:id` → Detalle equipo
- [ ] `/torneo/:id` → Detalle torneo

### **✅ Netlify Functions**
- [ ] `/.netlify/functions/signup-bypass` → POST signup
- [ ] `/.netlify/functions/signin-proxy` → POST login
- [ ] `/.netlify/functions/auto-confirm` → POST confirm
- [ ] `/.netlify/functions/test` → GET test

### **✅ Redirects**
- [ ] `/auth/*` → index.html (SPA)
- [ ] `/oauth/*` → index.html (SPA)
- [ ] `/registro*` → index.html (SPA)
- [ ] `/api/*` → functions (proxy)
- [ ] `/*` → index.html (catch-all)

---

## 🚀 DEPLOYMENT CHECKLIST

### **Pre-Deploy**
- [x] Build sin errores: `npm run build`
- [x] Tests backend: `npm test`
- [x] RegistroNuevo.jsx corregido (imports duplicados)
- [x] videos.html creado (TikTok + Live)
- [x] AutoSaveService.js activado
- [x] RealtimeService.js activado
- [x] CardService.js activado
- [x] Archivos duplicados eliminados (12 archivos)

### **Deploy**
```powershell
# Método 1: PowerShell
.\deploy-netlify.ps1

# Método 2: Git push (auto-deploy)
git add .
git commit -m "feat: videos page + services activated"
git push origin master

# Método 3: Netlify CLI
netlify deploy --prod
```

### **Post-Deploy**
- [ ] Verificar https://futpro.vip/ carga
- [ ] Test OAuth Google: `/login` → Google → callback
- [ ] Test registro email: `/registro`
- [ ] Test navegación: homepage → menú → videos
- [ ] Test live streaming: videos.html → "Iniciar Transmisión"
- [ ] Test auto-save: Realizar acción → verificar localStorage
- [ ] Test realtime: Chat → enviar mensaje → recibir en otro tab
- [ ] Test cards: Generar tarjeta FIFA → verificar stats
- [ ] Verificar functions: Network tab → `/.netlify/functions/signup-bypass`
- [ ] Verificar redirects: Refresh en `/feed` → debe cargar SPA

---

## 📈 MÉTRICAS DE ÉXITO

### **Performance**
- Lighthouse Score: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Build Time: <2min

### **Funcionalidad**
- Auth success rate: >95%
- OAuth callback success: >98%
- Auto-save trigger rate: 100%
- Realtime latency: <500ms
- Function cold start: <1s

### **SEO & PWA**
- PWA installable: ✅
- Offline mode: ✅
- Service Worker: ✅
- Meta tags: ✅

---

## 🔧 TROUBLESHOOTING

### **Error: 502 en signup**
**Solución:** Usar `/.netlify/functions/signup-bypass`
```javascript
// En AuthPageUnificada.jsx
const response = await fetch('/.netlify/functions/signup-bypass', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

### **Error: OAuth redirect mismatch**
**Solución:** Verificar en Supabase Dashboard:
- Allowed Callback URLs: `https://futpro.vip/auth/callback`
- Site URL: `https://futpro.vip`

### **Error: Secrets scan bloqueando deploy**
**Solución:** Ya configurado en netlify.toml:
```toml
SECRETS_SCAN_ENABLED = "false"
```

### **Error: Ruta 404 en refresh**
**Solución:** Ya configurado en redirects:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📞 CONTACTO Y SOPORTE

**Proyecto:** FutPro 2.0  
**Repositorio:** maoaya/furpro2.0  
**Netlify Site:** futpro.vip  
**Supabase Project:** qqrxetxcglwrejtblwut

**Última Actualización:** 3 de noviembre de 2025
