# 🔍 DIAGNÓSTICO: OAuth Duplicados y bad_oauth_state

## ❌ PROBLEMA IDENTIFICADO

El error `bad_oauth_state` ocurre porque **hay múltiples archivos iniciando OAuth de forma independiente**, causando conflictos en el flujo PKCE.

### Archivos que inician OAuth (DUPLICADOS):

1. **LoginRegisterForm.jsx** (línea 57) - Página de login principal
   ```javascript
   supabase.auth.signInWithOAuth({
     provider: 'google',
     options: { redirectTo: config.oauthCallbackUrl }
   })
   ```

2. **AuthContext.jsx** (líneas 363, 417) - Context de autenticación
   ```javascript
   supabase.auth.signInWithOAuth({
     provider: 'google',
     options: { redirectTo: callbackUrl }
   })
   ```

3. **AuthService.js** (líneas 137, 170) - Servicio de auth
   ```javascript
   supabase.auth.signInWithOAuth(config)
   ```

4. **AuthPageUnificada.jsx** (líneas 256, 298) - Otra página de auth
   ```javascript
   supabase.auth.signInWithOAuth({
     provider: 'google',
     options: { redirectTo: `${config.baseUrl}/auth/callback` }
   })
   ```

5. **RegistroBasico.jsx** (línea 12) - Registro básico
6. **LoginFallback.jsx** (línea 13) - Fallback manual

### URLs de Callback que se están usando:

- `config.oauthCallbackUrl` → `https://futpro.vip/auth/callback` ✅
- `${config.baseUrl}/auth/callback` → `https://futpro.vip/auth/callback` ✅
- Manual: `${supabaseUrl}/auth/v1/authorize?...` ❌ (método deprecated)

## 🎯 SOLUCIÓN REQUERIDA

### 1. Centralizar OAuth en UN SOLO LUGAR

**Usar SOLO:** `LoginRegisterForm.jsx` para iniciar OAuth desde el login.

**Eliminar o comentar OAuth de:**
- AuthContext.jsx (usar solo para manejar estado, no para iniciar login)
- AuthService.js (mantener solo helper, no ejecutar directamente)
- AuthPageUnificada.jsx (archivo obsoleto?)
- RegistroBasico.jsx (redirigir a LoginRegisterForm)
- LoginFallback.jsx (eliminar método manual)

### 2. Verificar Redirect URIs en Google Cloud Console

**Deben estar configuradas EXACTAMENTE así:**

#### Authorized JavaScript origins:
```
https://futpro.vip
http://localhost:5173
```

#### Authorized redirect URIs:
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
https://futpro.vip/auth/callback
http://localhost:5173/auth/callback
```

### 3. Verificar Redirect URLs en Supabase Dashboard

**Authentication → URL Configuration → Redirect URLs:**
```
https://futpro.vip/auth/callback
http://localhost:5173/auth/callback
```

### 4. Limpiar sesiones corruptas

Antes de probar, ejecutar en consola del navegador:
```javascript
localStorage.clear();
sessionStorage.clear();
// Cerrar y abrir pestaña en incógnito
```

## 🔧 CAMBIOS INMEDIATOS A APLICAR

1. ✅ **CallbackPageOptimized.jsx** - Ya actualizado para manejar errores
2. ⚠️ **LoginRegisterForm.jsx** - Verificar que sea el ÚNICO punto de entrada para OAuth
3. ❌ **AuthContext.jsx** - Comentar funciones `loginWithGoogle` y `loginWithFacebook` (solo manejar estado)
4. ❌ **AuthService.js** - Convertir en helpers sin ejecutar directamente
5. ❌ **Archivos obsoletos** - Deshabilitar o eliminar

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] Solo LoginRegisterForm.jsx inicia OAuth
- [ ] Google Cloud Console tiene las 3 URIs correctas
- [ ] Supabase tiene las 2 redirect URLs correctas
- [ ] localStorage/sessionStorage limpiados
- [ ] Probado en incógnito después de los cambios
- [ ] No aparece warning de "bounce tracking"
- [ ] No aparece error "bad_oauth_state"
- [ ] Usuario aterriza en /home después de login

## 🚨 CAUSA ROOT DEL ERROR

El error `bad_oauth_state` ocurre porque:
1. Usuario hace clic en "Continuar con Google" en LoginRegisterForm
2. Se genera un `state` token (PKCE) y se guarda en localStorage
3. Mientras tanto, otro componente (AuthContext, AuthService, etc.) inicia OTRO flujo OAuth
4. Se genera un NUEVO `state` token diferente
5. Cuando Google redirige de vuelta, el `state` no coincide con ninguno de los dos
6. Supabase rechaza con "bad_oauth_state" o "invalid_request"

**La solución es tener UN SOLO punto de inicio para OAuth.**
