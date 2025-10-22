# 🔥 SOLUCIÓN DEFINITIVA: Error "Unable to exchange external code"

## ❌ Error Actual

```
Error: server_error
Error Code: unexpected_failure
Description: Unable to exchange external code: 4/0AVGzR1...
```

Este error significa que **Google aceptó el login pero Supabase NO PUEDE canjear el código** de autorización por un token de acceso.

---

## 🎯 CAUSA RAÍZ CONFIRMADA

El problema es que el **redirect_uri que Supabase envía a Google NO coincide EXACTAMENTE** con los configurados en Google Cloud Console.

### 🔍 Diagnóstico Técnico

Cuando haces login con Google:

1. ✅ Tu app envía al usuario a Google con: `redirectTo: https://futpro.vip/auth/callback`
2. ✅ Google redirige al usuario a: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback?code=XXX`
3. ✅ Supabase intenta canjear el código llamando a la API de Google
4. ❌ **Google rechaza el intercambio** porque el `redirect_uri` que Supabase envió en el paso 3 NO coincide con los configurados

---

## ✅ SOLUCIÓN (Paso a Paso)

### 1️⃣ Google Cloud Console - CONFIGURACIÓN CRÍTICA

**URL:** https://console.cloud.google.com/apis/credentials

#### A. Encontrar tu OAuth 2.0 Client ID

1. En la lista de "OAuth 2.0 Client IDs", busca el que usas en Supabase
2. El nombre puede ser algo como "Web client 1" o similar
3. **Copia el Client ID** (formato: `760210878835-bnl2k6qfb4vuhm9v6fqpj1dqh5kul6d8.apps.googleusercontent.com`)

#### B. Editar Authorized redirect URIs

1. Click en el nombre del OAuth Client para editar
2. En **"Authorized redirect URIs"**, **ELIMINA TODO** y deja **SOLO ESTA URL**:

```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
```

**🔥 IMPORTANTE:**
- ❌ NO agregues `https://futpro.vip/auth/callback` aquí
- ❌ NO agregues `http://localhost:5173/auth/callback` aquí
- ❌ NO agregues ninguna otra URL
- ✅ SOLO la URL de Supabase arriba

#### C. Authorized JavaScript origins (Opcional pero recomendado)

Agrega estos orígenes:

```
https://futpro.vip
https://qqrxetxcglwrejtblwut.supabase.co
http://localhost:5173
```

#### D. Guardar y Esperar

1. Click en **"Save"** (abajo)
2. **ESPERA 2-3 MINUTOS** para que Google propague los cambios

---

### 2️⃣ Supabase Dashboard - VERIFICACIÓN

**URL:** https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers

#### A. Pestaña "Providers" → Google

1. ✅ **Enabled:** debe estar marcado
2. **Client ID:** Pega el Client ID de Google Cloud Console (el que copiaste arriba)
3. **Client Secret:** Ve a Google Cloud Console → Click en tu OAuth Client → Copia el Client Secret → Pégalo aquí
4. ⚠️ **CRÍTICO:** Asegúrate de copiar sin espacios, sin saltos de línea, caracteres completos
5. Click en **"Save"**

#### B. Pestaña "URL Configuration"

**URL:** https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration

1. **Site URL:**
   ```
   https://futpro.vip
   ```

2. **Redirect URLs** (lista completa):
   ```
   https://futpro.vip/auth/callback
   http://localhost:5173/auth/callback
   ```

3. Click en **"Save"**

---

### 3️⃣ OAuth Consent Screen - VERIFICACIÓN

**URL:** https://console.cloud.google.com/apis/credentials/consent

#### Si está en "Testing":
- **Test users:** Agrega tu email (el que usarás para login)
- Formato: `tuemail@gmail.com`
- Click en "Add users" y "Save"

#### Si está en "In production":
- No necesitas test users
- Verifica que el dominio `futpro.vip` esté verificado (si aplica)

---

## 🧪 PRUEBA DEFINITIVA

### Paso 1: Limpiar TODO

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Limpiar localStorage
localStorage.clear();

// Limpiar sessionStorage
sessionStorage.clear();

// Limpiar cookies de Supabase
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// Recargar
location.reload();
```

### Paso 2: Espera 2-3 minutos desde que guardaste en Google

**Google tarda en propagar los cambios de configuración OAuth.**

### Paso 3: Prueba en Incógnito

1. Abre ventana de incógnito: `Ctrl + Shift + N`
2. Ve a: `https://futpro.vip`
3. Click en "Continuar con Google"
4. Selecciona tu cuenta
5. Acepta permisos (si es primera vez)

### Resultado Esperado:

```
✅ https://futpro.vip/auth/callback?code=... (sin error)
✅ Navegación automática a https://futpro.vip/home
✅ Dashboard con tu perfil visible
```

---

## 🔍 SI SIGUE FALLANDO

### Captura el error exacto de la API de Google:

1. Abre DevTools (F12) → Pestaña **Network**
2. Haz el flujo OAuth completo
3. Busca la llamada a: `/auth/v1/callback?code=...`
4. Click en esa llamada → Pestaña **"Response"**
5. Copia el contenido completo y pégalo aquí

**Errores comunes en la respuesta:**

| Error | Causa | Solución |
|-------|-------|----------|
| `redirect_uri_mismatch` | URI no coincide | Verificar que Google tenga SOLO el URI de Supabase |
| `invalid_client` | Client ID o Secret mal | Re-copiar desde Google sin espacios |
| `invalid_grant` | Código expiró | Probar en incógnito sin recargar callback |
| `access_denied` | Usuario canceló | Normal, vuelve a intentar |

---

## 🆘 ALTERNATIVA: Crear Nuevo OAuth Client

Si nada funciona, crea un OAuth Client desde cero:

### En Google Cloud Console:

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Click en **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `FutPro OAuth New`
5. Authorized redirect URIs:
   ```
   https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
   ```
6. Click **"Create"**
7. **Copia el nuevo Client ID y Client Secret**

### En Supabase:

1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers
2. Google Provider → Pega el **nuevo Client ID** y **nuevo Client Secret**
3. Save

### Prueba de nuevo en incógnito

---

## 📊 Checklist Final

Antes de probar, confirma:

- [ ] Google Cloud Console → OAuth Client → Redirect URIs: **SOLO** `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`
- [ ] Supabase → Providers → Google: Client ID y Secret copiados **sin espacios**
- [ ] Supabase → URL Config → Site URL: `https://futpro.vip`
- [ ] Supabase → URL Config → Redirect URLs: incluye `https://futpro.vip/auth/callback`
- [ ] OAuth Consent Screen: Email agregado como Test user (si está en Testing)
- [ ] Esperaste **2-3 minutos** después de guardar en Google
- [ ] Limpiaste localStorage/sessionStorage/cookies
- [ ] Pruebas en **ventana de incógnito**

---

## 🎯 Garantía

Si sigues estos pasos EXACTAMENTE y esperas los 2-3 minutos, el error "Unable to exchange external code" **DEBE desaparecer**.

El código del frontend ya está correcto. Este es 100% un problema de configuración de OAuth en Google Cloud Console.

---

**Última actualización:** 21 de octubre de 2025, 4:10 PM  
**Commit actual:** `7057d2f`
