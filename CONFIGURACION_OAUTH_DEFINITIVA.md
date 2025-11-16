# 🔐 CONFIGURACIÓN OAUTH GOOGLE - GUÍA DEFINITIVA

## ✅ ESTADO ACTUAL DEL CÓDIGO

El código **YA ESTÁ CONFIGURADO CORRECTAMENTE**:
- ✅ `LoginRegisterFormClean.jsx` usa `${window.location.origin}/auth/callback`
- ✅ `AuthCallback.jsx` maneja el callback y redirige a `/perfil-card`
- ✅ `environment.js` detecta automáticamente el entorno correcto

**URLs que el código está usando:**
- **Producción**: `https://futpro.vip/auth/callback`
- **Netlify preview**: `https://[deploy-id]--futprovip.netlify.app/auth/callback`
- **Desarrollo local**: `http://localhost:5173/auth/callback`

---

## 🚨 LO QUE DEBES CONFIGURAR AHORA

### PASO 1: SUPABASE DASHBOARD (CRÍTICO)

1. **Ir a**: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration

2. **En "Redirect URLs" agregar ESTAS 3 URLs (una por línea):**
   ```
   https://futpro.vip/auth/callback
   https://futpro.vip/*
   http://localhost:5173/auth/callback
   ```

3. **En "Site URL" poner:**
   ```
   https://futpro.vip
   ```

4. **Hacer clic en "Save"** (botón verde abajo a la derecha)

5. **Verificar en "Authentication > Providers > Google":**
   - ✅ Google provider debe estar **Enabled**
   - ✅ Client ID debe ser: `760210878835-bnl2k6qfb4vuhm9v6fqpj1dqh5kul6d8.apps.googleusercontent.com`
   - ✅ Client Secret debe estar configurado (campo oculto con ***)
   - ✅ "Skip nonce check" debe estar **DESACTIVADO** (por seguridad)

---

### PASO 2: GOOGLE CLOUD CONSOLE (CRÍTICO)

1. **Ir a**: https://console.cloud.google.com/apis/credentials

2. **Buscar el OAuth Client ID**: `760210878835-bnl2k6qfb4vuhm9v6fqpj1dqh5kul6d8.apps.googleusercontent.com`

3. **En "Authorized redirect URIs" agregar ESTAS URLs:**
   ```
   https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
   https://futpro.vip/auth/callback
   http://localhost:5173/auth/callback
   ```

   **⚠️ IMPORTANTE**: La primera URL es la de Supabase (termina en `/auth/v1/callback`), las otras dos son del frontend.

4. **En "Authorized JavaScript origins" agregar:**
   ```
   https://futpro.vip
   https://qqrxetxcglwrejtblwut.supabase.co
   http://localhost:5173
   ```

5. **Hacer clic en "Save"** (botón azul)

---

## 🔍 VERIFICACIÓN DESPUÉS DE CONFIGURAR

### Test 1: Verificar configuración Supabase
```bash
# En PowerShell
curl -X GET "https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/settings" `
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.F6GSIfkPgpgrcXkJU8b2PHhv-T5Lh36WSS2xdiuH-C8"
```

Deberías ver `"external_google_enabled": true` en la respuesta.

### Test 2: Probar OAuth en producción

1. **Abrir en modo incógnito**: https://futpro.vip
2. **Click en "Continuar con Google"**
3. **Seleccionar cuenta de Google**
4. **Deberías ver**: Redirección a `/perfil-card` con tu información

### Test 3: Revisar errores en consola

Si falla, **abrir DevTools (F12) > Console** y buscar:
- ✅ `"🔐 [LOGIN] Iniciando OAuth con google..."` → Confirmación de inicio
- ✅ `"✅ Redirigiendo a Google..."` → Código funcional
- ❌ `"401"` o `"Unauthorized"` → URLs no configuradas en Supabase
- ❌ `"redirect_uri_mismatch"` → URLs no configuradas en Google Cloud

---

## 🔧 SOLUCIÓN A ERRORES COMUNES

### Error: "401 Unauthorized"
**Causa**: Las redirect URLs no están en Supabase Dashboard  
**Solución**: Ir a paso 1 y agregar las 3 URLs exactamente como se muestra

### Error: "redirect_uri_mismatch"
**Causa**: La URL de callback no está en Google Cloud Console  
**Solución**: Ir a paso 2 y agregar la URL de Supabase (`/auth/v1/callback`)

### Error: "Invalid state parameter"
**Causa**: Cookies/localStorage conflictivo  
**Solución**: 
```javascript
// Ejecutar en consola del navegador:
localStorage.clear();
sessionStorage.clear();
// Luego recargar página (F5)
```

### Error: "Provider not enabled"
**Causa**: Google provider desactivado en Supabase  
**Solución**: Supabase Dashboard > Authentication > Providers > Google > Enable

---

## 📋 CHECKLIST FINAL

Antes de probar, verificar que:
- [ ] Supabase > URL Configuration tiene las 3 redirect URLs
- [ ] Supabase > Google Provider está "Enabled"
- [ ] Google Cloud Console tiene la URL de Supabase callback
- [ ] Deploy está completo en https://futpro.vip
- [ ] Navegador en modo incógnito (sin cookies viejas)

---

## 🎯 RESULTADO ESPERADO

**Flujo completo exitoso:**
1. Usuario va a https://futpro.vip
2. Click "Continuar con Google"
3. Popup/redirect de Google (seleccionar cuenta)
4. Callback a https://futpro.vip/auth/callback (automático)
5. Redirect a https://futpro.vip/perfil-card (con datos del usuario)
6. Botón "Ir a Home" → https://futpro.vip/homepage-instagram.html

**Si ves esto, TODO ESTÁ FUNCIONANDO ✅**

---

## 📞 SI AÚN NO FUNCIONA

1. **Compartir screenshot** del error en consola (F12)
2. **Compartir screenshot** de Supabase > URL Configuration
3. **Verificar** que https://futpro.vip carga correctamente (no ERR_NAME_NOT_RESOLVED)
4. **Probar** primero en https://691947b062d40b758a748694--futprovip.netlify.app (URL directa de Netlify)

---

**Última actualización**: 16 nov 2025  
**URLs configuradas en código**: ✅ Correctas  
**Pendiente**: Configuración manual en dashboards de Supabase y Google
