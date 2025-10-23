# 🧪 PRUEBA OAUTH EN PRODUCCIÓN - GUÍA PASO A PASO

**Commit:** 900e758  
**Fecha:** 22 de octubre de 2025  
**URL:** https://futpro.vip

---

## 📋 PASOS PARA PROBAR

### 1️⃣ Abrir Modo Incógnito
- **Chrome/Edge:** Presiona `Ctrl + Shift + N`
- **Firefox:** Presiona `Ctrl + Shift + P`

### 2️⃣ Abrir DevTools
- Presiona `F12` para abrir DevTools
- Ve a la pestaña **Console**
- Mantén DevTools abierto durante toda la prueba

### 3️⃣ Limpiar Storage Completamente
En la consola de DevTools, ejecuta estos comandos:

```javascript
localStorage.clear();
sessionStorage.clear();
console.log('✅ Storage limpiado');
location.reload();
```

### 4️⃣ Navegar a FutPro
```
https://futpro.vip
```

### 5️⃣ Iniciar Login con Google
1. Busca el botón **"Continuar con Google"**
2. Haz clic
3. **Observa la consola** - deberías ver logs como:
   ```
   🔑 Llamando a signInWithOAuth...
   ✅ OAuth iniciado correctamente
   ```

### 6️⃣ Seleccionar Cuenta de Google
1. En la ventana de Google, selecciona tu cuenta
2. Acepta permisos si es necesario
3. Google te redirigirá a: `https://futpro.vip/auth/callback?code=...`

### 7️⃣ Verificar Logs en Callback
**En la consola deberías ver (en este orden):**

```
🔄 CallbackPage: Procesando callback OAuth...
🔍 DEBUG CALLBACK URL: { fullURL: "https://futpro.vip/auth/callback?code=...", ... }
⏳ Procesando callback manualmente...
🔁 Intercambiando code por sesión con Supabase (PKCE)...
✅ Sesión establecida con exchangeCodeForSession: tu-email@gmail.com
✅ Usuario OAuth autenticado: tu-email@gmail.com
✅ Perfil existente encontrado: Tu Nombre
🎉 OAuth callback procesado. Guardando sesión y navegando...
🎯 FORZANDO NAVEGACIÓN DIRECTA A /HOME
🔄 Ejecutando window.location.href = "/home"
```

### 8️⃣ Resultado Esperado
- ✅ **La página navega automáticamente a:** `https://futpro.vip/home`
- ✅ **Ves tu dashboard/perfil**
- ✅ **No regresas a login**

---

## ❌ SI ALGO FALLA

### Error: "Unable to exchange external code"

**Aparece en:** Console después del redirect desde Google

**Causa probable:**
- Client Secret incorrecto en Supabase
- Redirect URIs mal configurados en Google Cloud Console

**Solución:**

#### A. Verificar Client Secret

1. Ve a Google Cloud Console:
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. Busca el Client ID:
   ```
   YOUR_GOOGLE_OAUTH_CLIENT_ID
   ```

3. Click en el nombre → **Copiar Client Secret**

4. Ve a Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers
   ```

5. En "Google Provider":
   - Pega el Client Secret (sin espacios, sin saltos de línea)
   - Click **"Save"**

6. **IMPORTANTE:** Espera 3-5 minutos antes de probar

#### B. Verificar Redirect URIs en Google

1. En Google Cloud Console → Credentials
2. Click en el OAuth Client ID
3. En "Authorized redirect URIs" debe tener **SOLO:**
   ```
   https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
   ```

4. **NO debe tener:**
   - ❌ `https://futpro.vip/auth/callback`
   - ❌ `http://localhost:5173/auth/callback`
   - ❌ Ninguna otra URL

5. Si tiene URLs extras, **elimínalas**
6. Click **"SAVE"**
7. Espera 3-5 minutos

---

### Error: "bad_oauth_state"

**Solución:**
```javascript
// En Console:
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

Luego intenta el login nuevamente.

---

### Error: Vuelve a la página de login

**Causa:** El callback procesó correctamente pero la navegación a /home falló.

**Logs a buscar en Console:**
```
🎯 FORZANDO NAVEGACIÓN DIRECTA A /HOME
🔄 Ejecutando window.location.href = "/home"
```

**Si ves esos logs pero igual regresa a login:**

1. Verifica que no haya redirección en `FutProAppDefinitivo.jsx`
2. Verifica que `AuthContext` detecta el usuario correctamente
3. Revisa si hay errores de JavaScript en Console

---

## 📸 LOGS COMPLETOS A COPIAR

**Si el login falla, copia TODO lo siguiente:**

### 1. De Console:
```javascript
// Ejecuta esto y copia el resultado:
console.log({
  url: window.location.href,
  localStorage: { ...localStorage },
  sessionStorage: { ...sessionStorage },
  cookies: document.cookie
});
```

### 2. De Network Tab:
- Ve a DevTools → Network
- Busca la llamada a `/auth/v1/callback`
- Click derecho → Copy → Copy as cURL

### 3. Todo el historial de Console:
- Click derecho en Console
- "Save as..."
- Guarda como `console-log-oauth-error.txt`

---

## ✅ CHECKLIST DE VERIFICACIÓN

Marca cada paso que completes:

- [ ] Abrí modo incógnito
- [ ] Abrí DevTools (F12)
- [ ] Ejecuté `localStorage.clear(); sessionStorage.clear(); location.reload();`
- [ ] Navegué a https://futpro.vip
- [ ] Hice clic en "Continuar con Google"
- [ ] Vi logs de OAuth iniciando
- [ ] Seleccioné mi cuenta de Google
- [ ] La URL cambió a `/auth/callback?code=...`
- [ ] Vi el log: "✅ Sesión establecida con exchangeCodeForSession"
- [ ] Vi el log: "🎯 FORZANDO NAVEGACIÓN DIRECTA A /HOME"
- [ ] La página navegó a `/home`
- [ ] Veo mi dashboard/perfil
- [ ] NO regresé a login

---

## 🎯 RESULTADO ESPERADO

✅ **ÉXITO:** Login con Google → Callback procesa code → Navega a /home → Dashboard visible

❌ **FALLO:** Si NO ves los logs de "exchangeCodeForSession" o vuelves a login

---

## 📞 REPORTAR RESULTADO

Después de probar, reporta:

1. ✅ **Si funcionó:** "Login exitoso, estoy en /home"
2. ❌ **Si falló:** 
   - Copia TODO el contenido de Console
   - Copia la URL completa en el momento del error
   - Describe qué paso del proceso falló

---

**¡Prueba ahora y reporta el resultado!** 🚀
