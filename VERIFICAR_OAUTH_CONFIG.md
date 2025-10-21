# 🔐 Verificación de Configuración OAuth - FutPro

## ❌ Error Actual
```
?error=invalid_request
&error_code=bad_oauth_state
&error_description=OAuth+callback+with+invalid+state
```

Este error significa que el parámetro `state` usado en PKCE OAuth no coincide entre:
1. La petición inicial (cuando haces clic en "Continuar con Google")
2. El callback (cuando Google te redirige de vuelta)

## 🔍 Causas Comunes

### 1. Redirect URIs no coinciden EXACTAMENTE
Google Cloud Console debe tener **exactamente** estas URIs:

**Authorized redirect URIs:**
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
https://futpro.vip/auth/callback
http://localhost:5173/auth/callback
```

**Authorized JavaScript origins:**
```
https://futpro.vip
http://localhost:5173
```

### 2. Supabase Allowed Redirect URLs
En Supabase Dashboard → Authentication → URL Configuration:

**Allowed Redirect URLs (una por línea):**
```
https://futpro.vip/auth/callback
http://localhost:5173/auth/callback
https://futpro.vip/**
http://localhost:5173/**
```

### 3. Chrome Bounce Tracking Mitigation
Chrome 120+ bloquea "bounce tracking" (redirecciones intermedias). Solución:

**Opción A: Desactivar temporalmente para pruebas**
1. Ve a `chrome://flags`
2. Busca "Bounce tracking mitigations"
3. Cambia a "Disabled"
4. Reinicia Chrome

**Opción B: Configurar excepción para Supabase**
1. Ve a `chrome://settings/content/all`
2. Busca `qqrxetxcglwrejtblwut.supabase.co`
3. Permite cookies de terceros para este sitio

### 4. Storage Corrupto
El fix que acabo de implementar limpia automáticamente el storage cuando detecta `bad_oauth_state`.

## ✅ Pasos para Resolver

### 1. Verifica Google Cloud Console
```
https://console.cloud.google.com/apis/credentials
```
- Encuentra tu OAuth 2.0 Client ID: `760210878835-bnl2k6qfb4vuhm9v6fqpj1dqh5kul6d8.apps.googleusercontent.com`
- Edita y verifica que las URIs coincidan EXACTAMENTE (sin trailing slash, protocolo correcto)

### 2. Verifica Supabase Dashboard
```
https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut
```
- Ve a Authentication → URL Configuration
- Verifica Allowed Redirect URLs

### 3. Prueba en Incógnito con Storage Limpio
```bash
# Comando para abrir Chrome en incógnito
start chrome --incognito https://futpro.vip
```

### 4. Revisa la Consola del Navegador
Cuando hagas clic en "Continuar con Google", busca en la consola:
```javascript
🚀 DIAGNÓSTICO GOOGLE OAUTH:
- Callback URL: https://futpro.vip/auth/callback
- Supabase URL: https://qqrxetxcglwrejtblwut.supabase.co
```

## 🔧 Fix Aplicado

He modificado `CallbackPageOptimized.jsx` para:
1. Detectar `bad_oauth_state` específicamente
2. Limpiar todo el storage (localStorage, sessionStorage, cookies)
3. Redirigir a login limpio después de 2.5 segundos
4. Mostrar mensaje claro en pantalla

## 📝 Siguiente Paso

1. **Commit y push los cambios:**
```bash
git add .
git commit -m "fix: manejo de bad_oauth_state - limpiar storage y redirigir a login limpio"
git push
```

2. **Espera a que Netlify despliegue** (2-3 minutos)

3. **Prueba en incógnito:**
   - Cierra TODAS las ventanas de Chrome
   - Abre Chrome en incógnito
   - Ve a https://futpro.vip
   - Haz clic en "Continuar con Google"
   - Observa la consola

4. **Si sigue fallando, copia TODO el log de la consola** cuando veas:
```
❌❌❌ ERROR COMPLETO EN CALLBACK ❌❌❌
```

## 🆘 Si Nada Funciona

Prueba este endpoint directo de Supabase para verificar OAuth:
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://futpro.vip/auth/callback
```

Si esto funciona pero tu app no, el problema está en cómo `supabaseClient.js` está configurando el cliente.
