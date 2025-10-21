# 🔧 FIX: Error "Unable to exchange external code" - Google OAuth

## 🚨 Problema Actual

```
Error: server_error
Error Code: unexpected_failure
Description: Unable to exchange external code: 4/0AVGzR1...
```

Este error ocurre **después** de que Google acepta el login y **antes** de que Supabase pueda canjear el código de autorización por un token de acceso.

## 🎯 Causa Raíz

El `redirect_uri` que Supabase envía a Google **NO coincide exactamente** con alguno de los URIs configurados en Google Cloud Console. Google es **extremadamente estricto** con este match (incluso un `/` extra o `http` vs `https` rompe todo).

---

## ✅ Solución Paso a Paso

### 1️⃣ Google Cloud Console

**URL:** https://console.cloud.google.com/apis/credentials

1. Encuentra tu **OAuth 2.0 Client ID** (el que usas con Supabase)
2. Haz click en el nombre para editar
3. En **"Authorized redirect URIs"**, debe estar **EXACTAMENTE ESTA URL** (ni más ni menos):

```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
```

4. **NO pongas** `https://futpro.vip/auth/callback` aquí (esa es para tu app, no para Google)
5. En **"Authorized JavaScript origins"** (opcional pero recomendado):

```
https://futpro.vip
http://localhost:5173
```

6. **Guarda cambios** y espera 1-2 minutos para propagación

---

### 2️⃣ Supabase Dashboard

**URL:** https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers

#### Pestaña "Providers" → Google:

1. **Client ID:** (copia EXACTAMENTE desde Google Cloud Console, sin espacios)
2. **Client Secret:** (copia EXACTAMENTE desde Google Cloud Console, sin espacios)
3. ✅ **Enabled:** debe estar marcado
4. **Skip nonce check:** déjalo sin marcar (por defecto)
5. Guarda cambios

#### Pestaña "URL Configuration":

**URL:** https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration

1. **Site URL:**
   ```
   https://futpro.vip
   ```

2. **Redirect URLs** (lista completa, una por línea):
   ```
   https://futpro.vip/auth/callback
   http://localhost:5173/auth/callback
   ```

3. Guarda cambios

---

### 3️⃣ Verificar Estado de OAuth Consent Screen

**URL:** https://console.cloud.google.com/apis/credentials/consent

- Si está en **"Testing"**: Agrega tu email como **Test user**
- Si está en **"In production"**: No necesitas test users, pero verifica que el dominio esté verificado

---

## 🧪 Cómo Probar

### Antes de probar:
```javascript
// En consola del navegador (F12):
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Flujo esperado:
1. Click en "Continuar con Google" en https://futpro.vip
2. Selecciona cuenta de Google
3. Acepta permisos (si es primera vez)
4. **DEBE volver a:** `https://futpro.vip/auth/callback?code=...` (sin error)
5. **DEBE navegar a:** `https://futpro.vip/home` (en menos de 1 segundo)

---

## 🔍 Diagnóstico Adicional

Si sigue fallando después de los pasos anteriores:

### Ver request completo en Network tab:

1. Abre DevTools (F12) → **Network tab**
2. Filtra por: `callback`
3. Haz el flujo OAuth completo
4. Busca la llamada a `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback?code=...`
5. Mira la **Response** de esa llamada:
   - Si dice `redirect_uri_mismatch`: Google rechazó el URI
   - Si dice `invalid_client`: Client ID o Secret mal copiado
   - Si dice `invalid_grant`: El código expiró (pasa si recargas la página del callback)

### Logs de Supabase:

1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/logs/auth-logs
2. Filtra por las últimas 10 entradas
3. Busca errores relacionados con Google OAuth
4. Copia el mensaje exacto si aparece algo diferente a "redirect_uri_mismatch"

---

## 📝 Checklist Final

Antes de probar, confirma que:

- [ ] Google Cloud Console → Redirect URIs: **SOLO** tiene `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`
- [ ] Supabase → Providers → Google: Client ID y Secret copiados **sin espacios ni saltos de línea**
- [ ] Supabase → URL Config → Site URL: `https://futpro.vip`
- [ ] Supabase → URL Config → Redirect URLs: incluye `https://futpro.vip/auth/callback`
- [ ] OAuth Consent Screen: Tu email está como Test user (si está en Testing)
- [ ] Esperaste 1-2 minutos después de guardar cambios en Google
- [ ] Limpiaste localStorage/sessionStorage antes de probar

---

## 🎯 Resultado Esperado

Después de aplicar el fix:

```
✅ Click "Continuar con Google"
✅ Redirección a Google
✅ Selección de cuenta
✅ Callback sin errores
✅ Navegación a /home
✅ Usuario autenticado en dashboard
```

---

## 🆘 Si Nada Funciona

1. **Crea un NUEVO OAuth Client** en Google Cloud Console desde cero
2. Usa el nuevo Client ID y Secret en Supabase
3. Asegúrate de que el Redirect URI sea **exactamente:** `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`
4. Prueba en ventana de incógnito

---

## 📊 Estado del Código

El código del frontend está **correcto**:
- ✅ `AuthContext.loginWithGoogle()` usa `redirectTo: config.oauthCallbackUrl`
- ✅ `config.oauthCallbackUrl` = `https://futpro.vip/auth/callback` (en producción)
- ✅ `CallbackPageOptimized.jsx` fuerza navegación a `/home` tras sesión exitosa

El problema es **100% configuración de Google + Supabase**, no del código.

---

**Última actualización:** 21 de octubre de 2025  
**Commit con fix de navegación:** `3795afd`
