# 🚨 FIX: Google OAuth Error 401 - Configuración Google Cloud Console

## El problema
Error 401 en `/auth/callback` significa que Google está rechazando el redirect porque la URL no está autorizada en Google Cloud Console.

## SOLUCIÓN: Configurar Google Cloud Console

### Paso 1: Acceder a Google Cloud Console
1. Ve a: https://console.cloud.google.com/
2. Selecciona tu proyecto de FutPro
3. Ve a **APIs & Services** > **Credentials**

### Paso 2: Editar OAuth Client
1. Busca el Client ID: `760210878835-9a2fj0jhtq7lh6q7e7pcnq6hvu37m86l.apps.googleusercontent.com`
2. Click en el **nombre del cliente OAuth** (ícono de lápiz para editar)

### Paso 3: Agregar Authorized redirect URIs

En la sección **"Authorized redirect URIs"**, agrega EXACTAMENTE estas URLs:

```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
https://futpro.vip/auth/callback
https://futpro.vip/oauth/callback
http://localhost:5173/auth/callback
```

**⚠️ IMPORTANTE:** La primera URL (`https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`) es la URL de Supabase que maneja el OAuth. **DEBE estar presente**.

### Paso 4: Guardar
Click en **"Save"** en la parte inferior.

### Paso 5: Esperar propagación
Los cambios en Google pueden tardar **2-5 minutos** en propagarse.

## Verificar configuración en Supabase

### Dashboard de Supabase:
1. Ve a: https://supabase.com/dashboard
2. **Authentication** > **Providers** > **Google**
3. Verifica:
   - ✅ **Enabled** está activado
   - ✅ **Client ID**: `760210878835-9a2fj0jhtq7lh6q7e7pcnq6hvu37m86l.apps.googleusercontent.com`
   - ✅ **Client Secret**: Debe coincidir con el de Google Cloud Console

### URL Configuration en Supabase:
1. **Authentication** > **URL Configuration**
2. **Redirect URLs** debe tener:
   ```
   https://futpro.vip/auth/callback
   https://futpro.vip/oauth/callback
   ```
3. **Site URL**: `https://futpro.vip`

## URLs CRÍTICAS que deben estar configuradas:

### En Google Cloud Console (Authorized redirect URIs):
- ✅ `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback` ⭐ **MÁS IMPORTANTE**
- ✅ `https://futpro.vip/auth/callback`
- ✅ `https://futpro.vip/oauth/callback`
- ✅ `http://localhost:5173/auth/callback` (desarrollo)

### En Supabase (Redirect URLs):
- ✅ `https://futpro.vip/auth/callback`
- ✅ `https://futpro.vip/oauth/callback`

## Después de configurar:

1. Espera **3-5 minutos**
2. Limpia la caché del navegador (Ctrl+Shift+Del)
3. Abre ventana **incógnito**
4. Prueba login con Google en `https://futpro.vip`

## Si sigue fallando:

Revisa en la consola del navegador (F12) el error completo y verifica que:
- El redirect URL que aparece en el error coincida EXACTAMENTE con los configurados
- No haya espacios extras en las URLs
- Las URLs usen `https://` (no `http://`) en producción
