# ✅ Cliente OAuth de Google OFICIAL para FutPro

Este documento fija el cliente OAuth de Google oficial usado en producción, y detalla los pasos para mantener coherencia en Supabase y Netlify, además de retirar clientes alternativos para evitar errores como `Unable to exchange external code`.

## 🎯 Cliente OAuth (Web) oficial
- Proyecto GCP: `practical-brace-466901-u1`
- Cliente: el que aparece en Google Cloud como Aplicación web y cuya URL de edición termina en:
  - `760210878835-2beijt9lbg88q1139admgklb69f4s2a4.apps.googleusercontent.com`
- Estado: Habilitado

> Nota: El Client ID no es secreto. El Client Secret sí lo es y debe residir únicamente en Supabase (Providers > Google).

## 🔧 Configuración correcta en Google (cliente oficial)
- Orígenes autorizados de JavaScript:
  - `https://futpro.vip`
  - `http://localhost:3000`
  - (opcional) `https://futprovip.netlify.app` si usas previews
- URIs de redireccionamiento autorizados:
  - `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`

> Importante: no añadir `https://futpro.vip/auth/callback` aquí. Ese callback final lo maneja Supabase.

## 🗄️ Supabase (coherencia)
- Authentication > URL Configuration:
  - Site URL: `https://futpro.vip`
  - Additional Redirect URLs:
    - `https://futpro.vip/auth/callback`
    - `http://localhost:3000/auth/callback`
- Authentication > Providers > Google:
  - Client ID: `760210878835-2beijt9lbg88q1139admgklb69f4s2a4.apps.googleusercontent.com`
  - Client Secret: (el del cliente oficial)

## 🌐 Netlify / Variables de entorno
- `VITE_GOOGLE_CLIENT_ID=760210878835-2beijt9lbg88q1139admgklb69f4s2a4.apps.googleusercontent.com`
- `VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co`
- `VITE_SUPABASE_ANON_KEY=...` (ya configurado)

> Tras cambios en Netlify, realizar redeploy.

## 🧹 Retiro del cliente alternativo (recomendado)
1) Identificar el otro **OAuth client (Web)** existente en Google Cloud.
2) Verificar que **NO** esté referenciado en Supabase ni en Netlify.
3) Deshabilitarlo o borrarlo para evitar confusiones futuras.

## ✅ Checklist de validación
- Navegación del flujo: `futpro.vip` → `accounts.google.com` → `supabase.co/auth/v1/callback` → `futpro.vip/auth/callback` → `/home`.
- En Supabase > Logs (Auth) no aparecen `invalid_client` ni `redirect_uri_mismatch`.
- `VITE_GOOGLE_CLIENT_ID` coincide con el cliente oficial.

## 🧪 Diagnóstico rápido (opcional)
- Ejecutar `oauth-diagnostico.js` desde la consola del navegador en producción para verificar `baseUrl`, `oauthCallbackUrl` y variables VITE.

---
Última actualización: dejar este cliente como único oficial y retirar el alternativo una vez confirmada la estabilidad del login en producción.
