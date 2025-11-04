# 🏗️ ARQUITECTURA COMPLETA FUTPRO 2.0
## Lista Detallada de Archivos Funcionales desde Login hasta Cada Opción del Menú

---

## 🔐 FLUJO DE AUTENTICACIÓN (LOGIN/REGISTRO)

### 1. Punto de Entrada
**Archivo**: `index.html` (raíz del proyecto)
- **Función**: Punto de entrada de la aplicación React
- **Ruta**: `/`
- **Carga**: `src/main.jsx` → monta la app React

### 2. Configuración de Entorno
**Archivo**: `src/config/environment.js`
- **Función**: Fuente única de configuración runtime
- **Alimenta**:
  - `VITE_SUPABASE_URL`: https://qqrxetxcglwrejtblwut.supabase.co
  - `VITE_SUPABASE_ANON_KEY`: Token público de Supabase
  - `VITE_GOOGLE_CLIENT_ID`: OAuth Google
  - `baseUrl`, `oauthCallbackUrl`, `homeRedirectUrl`
  - Flags de tracking y auto-confirm

### 3. Cliente Supabase (Único)
**Archivo**: `src/supabaseClient.js`
- **Función**: Cliente Supabase unificado para toda la app
- **Importa**: `environment.js` via `getConfig()`
- **Opciones**: PKCE, persistSession, detectSessionInUrl, autoRefreshToken
- **Usado por**: Todos los componentes y servicios que necesitan auth/DB

### 4. Contexto de Autenticación
**Archivo**: `src/context/AuthContext.jsx`
- **Función**: Proveedor de estado de usuario global
- **Expone**: `user`, `role`, `equipoId`, `userProfile`, `loading`, `error`
- **Proceso**:
  1. Lee sesión con `supabase.auth.getSession()`
  2. Busca/crea perfil en tabla `usuarios`
  3. Guarda indicadores en localStorage
  4. Activa tracking perezoso
- **Alimenta**: Todo el árbol de componentes React

### 5. Routing Principal
**Archivo**: `src/App.jsx`
- **Función**: Define rutas de la aplicación
- **Rutas clave**:
  - `/` → `LoginRegisterFormClean.jsx` (o `AuthPageUnificada.jsx`)
  - `/auth/callback` → `CallbackPageOptimized.jsx`
  - `/home` → `HomeRedirect.jsx` → `homepage-instagram.html`
  - `/perfil` → Componente React de perfil
  - `/marketplace`, `/ranking`, `/penaltis`, etc.

### 6. UI de Login/Registro
**Archivo**: `src/pages/LoginRegisterFormClean.jsx` (o `AuthPageUnificada.jsx`)
- **Función**: Formulario unificado de acceso
- **Opciones**:
  - Login con email/password
  - Registro con email/password
  - OAuth Google (via `supabase.auth.signInWithOAuth`)
  - OAuth Facebook
- **Usa**:
  - `src/utils/authUtils.js` → `robustSignIn`, `robustSignUp`
  - `src/utils/registroCompleto.js` → crear perfil completo
  - `src/utils/authFlowManager.js` → navegación post-login

### 7. Callback OAuth
**Archivo**: `src/pages/CallbackPageOptimized.jsx`
- **Función**: Procesa retorno de OAuth (Google/Facebook)
- **Proceso**:
  1. Obtiene sesión con `supabase.auth.getSession()`
  2. Crea perfil en `usuarios` si no existe
  3. Invoca `authFlowManager.handlePostLoginFlow()`
  4. Navega a `/home`

### 8. Manager de Flujo de Auth
**Archivo**: `src/utils/authFlowManager.js`
- **Función**: Orquesta post-login/registro
- **Clase**: `AuthFlowManager`
- **Métodos clave**:
  - `handlePostLoginFlow()`: Asegura perfil, guarda localStorage, navega
  - `handleCompleteRegistrationFlow()`: Registro + login + navegación
  - `ensureUserProfile()`: Crea/verifica registro en tabla `usuarios`
  - `executeRobustNavigation()`: Múltiples estrategias de navegación
- **Alimenta**: Indicadores de auth en localStorage y navegación segura

### 9. Utilidades de Auth
**Archivos**:
- `src/utils/authUtils.js`: `robustSignUp`, `robustSignIn`, `createUserProfile`
- `src/utils/registroCompleto.js`: Registro completo con perfil extendido
- `src/utils/navigationUtils.js`: `navigateToHome`, `handleSuccessfulAuth`

### 10. Variables de Entorno (.env)
**Archivos**:
- `.env.example`: Plantilla
- `.env.netlify`: Producción (usado en Netlify build)
- `.env.production`: Alternativa local de prod
- `.env.local`: Desarrollo local

**Variables críticas**:
```env
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (token público)
VITE_GOOGLE_CLIENT_ID=760210878835-...
VITE_AUTO_CONFIRM_SIGNUP=true
VITE_APP_BASE_URL=https://futpro.vip
```

### 11. Funciones Netlify (Serverless Anti-502)
**Archivos**:
- `functions/signup-bypass.js`: Registro con Service Role (sin CAPTCHA)
- `functions/signin-proxy.js`: Login proxy desde servidor
- `functions/signup-proxy.js`: Signup proxy (bypass CAPTCHA)
- `functions/auto-confirm.js`: Auto-confirmación de cuentas

**Configuración**: `netlify.toml`
```toml
[build]
  command = "cp .env.netlify .env.production || cp .env.netlify .env; npm run build"
  publish = "dist"
  functions = "functions"

[build.environment]
  VITE_AUTO_CONFIRM_SIGNUP = "true"
  SECRETS_SCAN_ENABLED = "false"
```

---

## 🏠 POST-LOGIN: HOMEPAGE INSTAGRAM

### 12. Redirect a Home
**Archivo**: `src/pages/HomeRedirect.jsx`
- **Función**: Redirige a página estática optimizada
- **Destino**: `/homepage-instagram.html`
- **Razón**: Render instantáneo sin React (performance)

### 13. Homepage Definitiva
**Archivo**: `public/homepage-instagram.html` (⭐ ÚNICA VERSIÓN)
- **Función**: Experiencia principal tipo Instagram
- **Features**:
  - Stories (crear, ver, interactuar)
  - Feed de posts (likes, comentarios, compartir)
  - Menú hamburguesa completo
  - Barra de navegación inferior
  - Auto-guardado global (`FutProAutoSave`)
  - Sistema de notificaciones
  - Chat en tiempo real
  - Marketplace integrado
  - Transmisión en vivo

---

## 🍔 MENÚ HAMBURGUESA: OPCIONES Y ARCHIVOS

El menú hamburguesa en `homepage-instagram.html` despliega **6 secciones**:

### SECCIÓN 1: PRINCIPAL

#### 1. 🏠 Inicio
- **Función JS**: `irAInicio()`
- **Destino**: `./homepage-instagram.html`
- **Archivo**: `public/homepage-instagram.html`

#### 2. 👤 Mi Perfil
- **Función JS**: `irAPerfil()`
- **Destino**: `./perfil-instagram.html`
- **Archivo**: `public/perfil-instagram.html`
- **Alimenta**: Vista de perfil estilo Instagram

#### 3. ✏️ Editar Perfil
- **Función JS**: `editarPerfil()`
- **Destino**: `./editar-perfil.html`
- **Archivo**: `editar-perfil.html` (raíz) + `src/components/EditarPerfil.jsx`
- **Alimenta**: Formulario de edición de datos personales

#### 4. 📊 Mis Estadísticas
- **Función JS**: `verEstadisticas()`
- **Destino**: `./estadisticas.html`
- **Archivo**: `estadisticas.html` (raíz)
- **Alimenta**: Dashboard de stats (partidos, goles, asistencias, etc.)

#### 5. 📅 Mis Partidos
- **Función JS**: `verPartidos()`
- **Destino**: `./partidos.html`
- **Archivo**: `partidos.html` (raíz)
- **Alimenta**: Historial de partidos jugados

#### 6. 🏅 Mis Logros
- **Función JS**: `verLogros()`
- **Destino**: `./logros.html`
- **Archivo**: `public/logros.html`
- **Alimenta**: Achievements y medallas

#### 7. 🆔 Mis Tarjetas
- **Función JS**: `verTarjetas()`
- **Destino**: `./carfutpro.html`
- **Archivo**: `carfutpro.html` (raíz)
- **Servicio**: `src/services/CardService.js` (vacío, a implementar)
- **Alimenta**: Tarjetas FIFA personalizadas del usuario

---

### SECCIÓN 2: EQUIPOS & TORNEOS

#### 8. 👥 Ver Equipos
- **Función JS**: `verEquipos()`
- **Destino**: `./equipos.html`
- **Archivo**: `equipos.html` (raíz)
- **Servicio**: `src/services/TeamManager.js`
- **Alimenta**: Lista de equipos, crear/unirse

#### 9. ➕ Crear Equipo
- **Función JS**: `crearEquipo()`
- **Modal**: Formulario inline en `homepage-instagram.html`
- **Servicio**: `src/services/TeamManager.js`
- **Guarda**: localStorage + Supabase tabla `teams`

#### 10. 🏆 Ver Torneos
- **Función JS**: `verTorneos()`
- **Destino**: `./torneo.html`
- **Archivo**: `torneo.html` (raíz)
- **Servicio**: `src/services/TournamentManager.js`
- **Alimenta**: Torneos activos, historial, inscripción

#### 11. ➕ Crear Torneo
- **Función JS**: `crearTorneo()`
- **Modal**: Formulario en `homepage-instagram.html`
- **Servicio**: `src/services/TournamentManager.js`
- **Guarda**: Supabase tabla `tournaments`

#### 12. 🤝 Crear Amistoso
- **Función JS**: `crearAmistoso()`
- **Destino**: `./amistoso.html`
- **Archivo**: `amistoso.html` (raíz)
- **Servicio**: `src/services/PartidoManager.js`
- **Alimenta**: Programar partidos amistosos

---

### SECCIÓN 3: JUEGOS & CARDS

#### 13. ⚽ Juego de Penaltis
- **Función JS**: `jugarPenaltis()`
- **Destino**: `./penaltis.html`
- **Archivo**: `public/penaltis.html`
- **Alimenta**: Minijuego de penaltis interactivo

#### 14. 🎮 Centro de Juegos
- **Función JS**: `centroJuegos()`
- **Destino**: `./juegos.html` ❌ (archivo a eliminar o reemplazar)
- **Alternativa**: Redirigir a `carfutpro.html` o crear página nueva

#### 15. 🆔 Card FIFA
- **Función JS**: `verCardFIFA()`
- **Destino**: `./carfutpro.html`
- **Archivo**: `carfutpro.html` (raíz)
- **Componente**: `src/components/FifaCard.js`
- **Servicio**: `src/services/CardService.js`

#### 16. 💡 Sugerencias Card
- **Función JS**: `sugerenciasCard()`
- **Modal**: Formulario en `homepage-instagram.html`
- **Servicio**: `src/services/sugerenciasService.js`

---

### SECCIÓN 4: SOCIAL

#### 17. 🔔 Notificaciones
- **Función JS**: `verNotificaciones()`
- **Destino**: `./notificaciones.html`
- **Archivo**: `notificaciones.html` (raíz)
- **Alimenta**: Lista de notificaciones en tiempo real

#### 18. 💬 Chat
- **Función JS**: `abrirChat()`
- **Destino**: `./chat.html`
- **Archivo**: `public/chat.html`
- **Servicio**: `src/services/ChatManager.js`
- **Firebase**: Realtime Database para mensajes

#### 19. 🎥 Videos
- **Función JS**: `verVideos()`
- **Destino**: `./videos.html` ❌ **NO EXISTE**
- **Acción requerida**: Crear `public/videos.html` o ajustar enlace

#### 20. 🛒 Marketplace
- **Función JS**: `abrirMarketplace()`
- **Destino**: `./marketplace.html`
- **Archivo**: `public/marketplace.html`
- **Alimenta**: Compra/venta de equipamiento deportivo

#### 21. 📋 Estados
- **Función JS**: `verEstados()`
- **Destino**: `./estados.html`
- **Archivo**: `estados.html` (raíz)
- **Alimenta**: Stories/estados de amigos

#### 22. 👫 Amigos
- **Función JS**: `verAmigos()`
- **Destino**: `./amigos.html`
- **Archivo**: `amigos.html` (raíz)
- **Alimenta**: Lista de amigos, solicitudes

#### 23. 📡 Transmitir en Vivo
- **Función JS**: `abrirTransmisionEnVivo()`
- **Modal**: Inline en `homepage-instagram.html`
- **Servicio**: `src/services/StreamManager.js`
- **Alimenta**: Streaming en vivo con WebRTC

---

### SECCIÓN 5: RANKINGS

#### 24. 📊 Ranking Jugadores
- **Función JS**: `rankingJugadores()`
- **Destino**: `./ranking.html`
- **Archivo**: `public/ranking.html`
- **Servicio**: `src/services/rankingJugadoresService.js`

#### 25. 📈 Ranking Partidos
- **Función JS**: `rankingPartidos()`
- **Modal**: Inline en `homepage-instagram.html`
- **Servicio**: `src/services/rankingService.js`

#### 26. 🔍 Buscar Ranking
- **Función JS**: `buscarRanking()`
- **Destino**: `./buscar-ranking.html`
- **Archivo**: `buscar-ranking.html` (raíz)

---

### SECCIÓN 6: ADMINISTRACIÓN

#### 27. ⚙️ Configuración
- **Función JS**: `abrirConfiguracion()`
- **Destino**: `./configuracion.html`
- **Archivo**: `configuracion.html` (raíz)
- **Alimenta**: Settings de cuenta, privacidad, notificaciones

#### 28. 💡 Sugerencias Card (duplicado)
- **Función JS**: `sugerenciasCard()`
- (Ver ítem 16)

#### 29. 🆘 Soporte
- **Función JS**: `contactarSoporte()`
- **Modal/Destino**: Formulario de contacto
- **Componente**: `src/components/ContactarSoporte.jsx`

#### 30. 🔒 Privacidad
- **Función JS**: `verPrivacidad()`
- **Destino**: Página de políticas de privacidad

#### 31. 🚪 Cerrar Sesión
- **Función JS**: `cerrarSesion()`
- **Proceso**:
  1. `supabase.auth.signOut()`
  2. Limpiar localStorage
  3. Redirigir a `/` (login)

---

## 📂 SERVICIOS CLAVE (src/services/)

### Autenticación y Usuario
- `AuthService.js`: Manejo de auth y roles
- `UserService.js`: CRUD de usuarios
- `usuarioService.js`: Servicios de perfil

### Social y Comunicación
- `ChatManager.js`: Chat en tiempo real (Firebase)
- `StreamManager.js`: Transmisiones en vivo (WebRTC)
- `NotificationsManager.js`: Sistema de notificaciones

### Equipos y Torneos
- `TeamManager.js`: Gestión de equipos
- `TournamentManager.js`: Gestión de torneos
- `PartidoManager.js`: Gestión de partidos

### Rankings y Estadísticas
- `rankingJugadoresService.js`: Ranking de jugadores
- `rankingCampeonatosService.js`: Ranking de campeonatos
- `rankingService.js`: Servicios generales de ranking
- `AnalyticsManager.js`: Tracking de eventos

### Marketplace y Contenido
- `MarketplaceManager.js`: Tienda de productos
- `MediaManager.js`: Gestión de fotos/videos
- `ProfileManager.js`: Gestión de perfiles

### Juegos y Cards
- `CardService.js`: Tarjetas FIFA (vacío)
- `PenaltyManager.js`: Lógica de penaltis

### Utilidades
- `AutoSaveService.js`: Auto-guardado (vacío, implementado en homepage)
- `RealtimeService.js`: Sincronización realtime (vacío)
- `TrackingInitializer.js`: Inicialización de tracking
- `UserActivityTracker.js`: Tracking de actividad

---

## 🗑️ ARCHIVOS A ELIMINAR (Duplicados/Obsoletos)

### Páginas duplicadas en raíz
- ❌ `homepage-instagram.html` (duplicado; mantener solo `public/homepage-instagram.html`)
- ❌ `homepage-solucionado.html`
- ❌ `produccion-homepage-instagram.html`
- ❌ `home.html`

### Backups de index
- ❌ `index-backup.html`
- ❌ `index-full.html`
- ❌ `index-react.html`

### Demos y tests públicos
- ❌ `fifa-card-demo.html` (usar `carfutpro.html`)
- ❌ `public/Untitled-1.html`
- ❌ `public/juegos.html` (decidir si mantener o migrar a carfutpro)
- ❌ `public/diagnostico-oauth-live.html`

### Diagnósticos raíz
- ❌ `diagnostico-react.html`
- ❌ `diagnostico-oauth-completo.html`
- ❌ `diagnostico-navegacion-completo.bat`

### Backups de componentes
- ❌ `src/pages/LoginRegisterForm.jsx.backup`
- ❌ `src/pages/LoginRegisterFormNUCLEAR.jsx` (si no se usa)

### Funciones Netlify duplicadas
- ❌ `netlify/functions/test.js`
- ❌ `netlify/functions/auto-confirm.js` (si duplica `functions/auto-confirm.js`)
- ❌ `functions/test.js`

---

## ✅ ARCHIVOS ESENCIALES A MANTENER

### Configuración raíz
- ✅ `package.json`
- ✅ `netlify.toml`
- ✅ `vite.config.js`
- ✅ `babel.config.cjs`
- ✅ `jest.backend.config.cjs`
- ✅ `jest.frontend.config.cjs`
- ✅ `jest.setup.js`
- ✅ `.env.example`
- ✅ `.env.netlify`
- ✅ `.env.production`
- ✅ `.env.local`

### Public (estáticas)
- ✅ `public/homepage-instagram.html` ⭐
- ✅ `public/chat.html`
- ✅ `public/marketplace.html`
- ✅ `public/ranking.html`
- ✅ `public/penaltis.html`
- ✅ `public/logros.html`
- ✅ `public/perfil-instagram.html`
- ✅ `public/_redirects`
- ✅ `public/_headers`
- ✅ `public/manifest.json`
- ✅ `public/sw.js`
- ✅ `public/offline.html`

### Páginas raíz (HTML estáticas no duplicadas)
- ✅ `index.html`
- ✅ `editar-perfil.html`
- ✅ `estadisticas.html`
- ✅ `partidos.html`
- ✅ `equipos.html`
- ✅ `torneo.html`
- ✅ `amistoso.html`
- ✅ `notificaciones.html`
- ✅ `estados.html`
- ✅ `amigos.html`
- ✅ `buscar-ranking.html`
- ✅ `configuracion.html`
- ✅ `carfutpro.html`

### Funciones Netlify
- ✅ `functions/signup-bypass.js`
- ✅ `functions/signin-proxy.js`
- ✅ `functions/signup-proxy.js`
- ✅ `functions/auto-confirm.js`

### React (src/)
- ✅ `src/main.jsx`
- ✅ `src/App.jsx`
- ✅ `src/supabaseClient.js`
- ✅ `src/config/environment.js`
- ✅ `src/context/AuthContext.jsx`
- ✅ `src/utils/authFlowManager.js`
- ✅ `src/utils/authUtils.js`
- ✅ `src/utils/registroCompleto.js`
- ✅ `src/utils/navigationUtils.js`
- ✅ `src/pages/HomeRedirect.jsx`
- ✅ `src/pages/CallbackPageOptimized.jsx`
- ✅ `src/pages/LoginRegisterFormClean.jsx` (o `AuthPageUnificada.jsx`)
- ✅ Todos los componentes en `src/components/`
- ✅ Todos los servicios en `src/services/`

---

## 🎯 PÁGINA FALTANTE

### Videos
- **Estado**: ❌ NO EXISTE `public/videos.html`
- **Referenciado en**: Menú hamburguesa → Social → Videos
- **Acción**: Crear página o deshabilitar enlace temporalmente

---

## 🔧 PROBLEMA ACTUAL: Build Fallando

### Error
`src/pages/RegistroNuevo.jsx` tiene imports y variables duplicadas:
```
ERROR: The symbol "React" has already been declared
ERROR: The symbol "useState" has already been declared
ERROR: The symbol "navigate" has already been declared
```

### Solución
1. Usar `src/pages/RegistroNuevoClean.jsx` si existe
2. O corregir duplicaciones en `RegistroNuevo.jsx`
3. Actualizar ruta en `src/App.jsx` si es necesario

---

## 📊 RESUMEN DE CONTEO

- **Páginas estáticas (public)**: 9 archivos
- **Páginas HTML raíz**: 15 archivos
- **Componentes React**: ~50 archivos
- **Servicios**: ~35 archivos
- **Utilidades**: ~20 archivos
- **Funciones Netlify**: 4 archivos
- **Archivos a eliminar**: ~15 duplicados/obsoletos

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Documentación completa (este archivo)
2. ⏳ Corregir `RegistroNuevo.jsx`
3. ⏳ Eliminar duplicados listados
4. ⏳ Crear `public/videos.html` o ajustar enlace
5. ⏳ Ejecutar `npm run build`
6. ⏳ Deploy a Netlify
7. ⏳ Verificar todas las opciones del menú en producción
