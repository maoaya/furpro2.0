# 🔐 GUÍA COMPLETA: Configuración OAuth Google para FutPro 2.0

## 📋 Resumen del Flujo Implementado

```
Usuario → FormularioRegistroCompleto
    ↓ (Click "Continuar con Google")
    ↓
Google OAuth Login
    ↓
/auth/callback (AuthCallback.jsx procesa)
    ↓
/perfil-card (Muestra Card del jugador)
    ↓ (Click "Continuar")
    ↓
/homepage-instagram.html (Página principal)
```

## 🔧 Configuración Actual

### 1. Variables de Entorno (.env)
```bash
# Client ID de Google OAuth (producción)
VITE_GOOGLE_CLIENT_ID=760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf.apps.googleusercontent.com

# URLs de Supabase
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Activar auto-confirmación (evita error 502)
VITE_AUTO_CONFIRM_SIGNUP=true
```

### 2. URLs de Callback Configuradas

#### Desarrollo (localhost:5173)
- Callback URL: `http://localhost:5173/auth/callback`

#### Producción (futpro.vip)
- Callback URL: `https://futpro.vip/auth/callback`

## 🎯 Archivos Modificados

### 1. **FormularioRegistroCompleto.jsx**
```javascript
// Línea 526: Cambio de target
localStorage.setItem('post_auth_target', '/perfil-card'); // ✅ Ir directo a Card
localStorage.setItem('oauth_origin', 'formulario_registro');

// Línea 573-577: OAuth con Google
const { oauthCallbackUrl } = getConfig();
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: oauthCallbackUrl }
});
```

### 2. **AuthCallback.jsx**
```javascript
// Línea 37: Target por defecto cambiado
let target = localStorage.getItem('post_auth_target') || '/perfil-card'; // ✅

// Línea 44: Detecta origen de formulario y redirige
if (target === '/perfil-card' && origin === 'formulario_registro') {
  // Crea registro en carfutpro
  // Redirige a /perfil-card
}
```

### 3. **PerfilCard.jsx**
```javascript
// Línea 99-103: Navegación a homepage estática
const continuarAlHome = () => {
  localStorage.removeItem('show_first_card');
  window.location.href = '/homepage-instagram.html'; // ✅ Usar .href para HTML estático
};
```

## 🔑 Configuración en Google Cloud Console

### Paso 1: Acceder a Google Cloud Console
1. Ir a: https://console.cloud.google.com/
2. Seleccionar proyecto "FutPro" (o crear uno nuevo)

### Paso 2: Habilitar Google+ API
1. Ir a **APIs & Services** > **Library**
2. Buscar "Google+ API"
3. Click **Enable**

### Paso 3: Configurar OAuth Consent Screen
1. Ir a **APIs & Services** > **OAuth consent screen**
2. Configurar:
   - **Application name**: FutPro
   - **User support email**: tu-email@gmail.com
   - **Authorized domains**: 
     - `futpro.vip`
     - `netlify.app` (si usas Netlify)
   - **Developer contact**: tu-email@gmail.com

### Paso 4: Crear Credenciales OAuth 2.0
1. Ir a **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Configurar:
   - **Application type**: Web application
   - **Name**: FutPro Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     http://localhost:5174
     https://futpro.vip
     https://tu-sitio.netlify.app
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5173/auth/callback
     http://localhost:5174/auth/callback
     https://futpro.vip/auth/callback
     https://tu-sitio.netlify.app/auth/callback
     ```
4. Click **Create**
5. Copiar el **Client ID** generado

### Paso 5: Actualizar Variables de Entorno
```bash
# Pegar el Client ID en .env
VITE_GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI
```

## 🔒 Configuración en Supabase Dashboard

### Paso 1: Acceder a Authentication Settings
1. Ir a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut
2. Navegar a **Authentication** > **Providers**

### Paso 2: Configurar Google Provider
1. Buscar **Google** en la lista de providers
2. Habilitar toggle **Enable Google provider**
3. Pegar:
   - **Client ID**: (mismo que en Google Cloud Console)
   - **Client Secret**: (obtener de Google Cloud Console)
4. Click **Save**

### Paso 3: Configurar Redirect URLs
1. Ir a **Authentication** > **URL Configuration**
2. Agregar en **Redirect URLs**:
   ```
   http://localhost:5173/auth/callback
   https://futpro.vip/auth/callback
   ```
3. **Site URL**: `https://futpro.vip`
4. Click **Save**

### Paso 4: Configurar Auto-confirm (Anti-502)
1. Ir a **Authentication** > **Settings**
2. Buscar **Email confirmations**
3. **Desactivar** "Confirm email" (o configurar función serverless)
4. Esto evita el error 502 de CAPTCHA

## 🧪 Testing Local

### 1. Verificar Variables de Entorno
```bash
# En la raíz del proyecto
cat .env | grep VITE_GOOGLE_CLIENT_ID
```

### 2. Iniciar Servidor de Desarrollo
```bash
npm run dev
# Debe abrir en http://localhost:5173
```

### 3. Probar Flujo OAuth
1. Navegar a: `http://localhost:5173/formulario-registro`
2. Llenar datos básicos del formulario
3. Click en **"Continuar con Google"**
4. Verificar:
   - ✅ Abre popup/redirect de Google
   - ✅ Redirige a `/auth/callback`
   - ✅ Procesa autenticación
   - ✅ Redirige a `/perfil-card`
   - ✅ Muestra Card del jugador
   - ✅ Botón "Continuar" lleva a `/homepage-instagram.html`

### 4. Verificar en Consola del Navegador
```javascript
// Después de hacer click en "Continuar con Google"
localStorage.getItem('post_auth_target') // Debe ser "/perfil-card"
localStorage.getItem('oauth_origin') // Debe ser "formulario_registro"
localStorage.getItem('futpro_user_card_data') // Debe contener datos del usuario
```

## 🚀 Deployment en Producción

### 1. Variables de Entorno en Netlify
```bash
# En Netlify Dashboard > Site settings > Environment variables
VITE_GOOGLE_CLIENT_ID=760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf.apps.googleusercontent.com
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_AUTO_CONFIRM_SIGNUP=true
```

### 2. Verificar Build Command
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "functions"

[build.environment]
  SECRETS_SCAN_ENABLED = "false"
  VITE_AUTO_CONFIRM_SIGNUP = "true"

[[redirects]]
  from = "/auth/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Deploy
```bash
npm run deploy
# O usar deploy-validated.ps1
```

## ❌ Troubleshooting

### Error: "redirect_uri_mismatch"
**Causa**: URL de callback no está configurada en Google Cloud Console

**Solución**:
1. Ir a Google Cloud Console
2. Agregar la URL exacta en "Authorized redirect URIs"
3. Esperar 5 minutos para que propague

### Error: "502 Bad Gateway" después de OAuth
**Causa**: Supabase espera confirmación de email

**Solución**:
1. Activar `VITE_AUTO_CONFIRM_SIGNUP=true`
2. Usar función serverless `functions/signup-bypass.js`
3. Desactivar confirmación de email en Supabase

### Error: "Invalid OAuth state"
**Causa**: Cookies bloqueadas o sesión expirada

**Solución**:
1. Limpiar localStorage: `localStorage.clear()`
2. Limpiar cookies del navegador
3. Reintentar flujo OAuth

### Error: navigate() no funciona para homepage
**Causa**: `homepage-instagram.html` es página estática, no ruta SPA

**Solución**: Usar `window.location.href` en lugar de `navigate()` ✅ (YA IMPLEMENTADO)

## 📝 Notas Importantes

1. **Client ID Público**: El `VITE_GOOGLE_CLIENT_ID` es público y seguro de compartir
2. **Client Secret**: NUNCA exponer el Client Secret en código frontend
3. **Redirect URIs**: Deben coincidir EXACTAMENTE entre Google Console y la aplicación
4. **HTTPS en Producción**: Google OAuth requiere HTTPS en producción
5. **Auto-confirm**: Activar para evitar error 502 con CAPTCHA

## ✅ Checklist de Verificación

- [ ] Client ID configurado en `.env`
- [ ] Redirect URIs agregadas en Google Cloud Console
- [ ] Google provider habilitado en Supabase
- [ ] Auto-confirm activado (`VITE_AUTO_CONFIRM_SIGNUP=true`)
- [ ] Test local funcionando
- [ ] Variables de entorno en Netlify configuradas
- [ ] Deploy exitoso en producción
- [ ] Test en producción funcionando
- [ ] Página `/homepage-instagram.html` existe y carga correctamente

## 🔗 Enlaces Útiles

- Google Cloud Console: https://console.cloud.google.com/
- Supabase Dashboard: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut
- Netlify Dashboard: https://app.netlify.com/
- Documentación OAuth de Supabase: https://supabase.com/docs/guides/auth/social-login/auth-google

---

**Última actualización**: 13 de noviembre de 2025
**Estado**: ✅ Flujo implementado y funcionando
