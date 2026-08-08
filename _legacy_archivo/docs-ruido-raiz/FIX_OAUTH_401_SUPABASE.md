# 🚨 FIX ERROR 401 OAUTH - CONFIGURACIÓN SUPABASE

## Problema
El OAuth con Google falla con error **401 Unauthorized** porque la URL de callback no está autorizada en Supabase.

## Solución: Agregar URLs de Redirect en Supabase

### Paso 1: Ir al Dashboard de Supabase
1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto **FutPro**
3. Ve a **Authentication** en el menú izquierdo
4. Click en **URL Configuration**

### Paso 2: Agregar Redirect URLs
En el campo **"Redirect URLs"**, agrega las siguientes URLs (una por línea):

```
https://futpro.vip/auth/callback
https://futpro.vip/oauth/callback
http://localhost:5173/auth/callback
http://localhost:5173/oauth/callback
```

### Paso 3: Configurar Site URL
En el campo **"Site URL"**, pon:

```
https://futpro.vip
```

### Paso 4: Guardar cambios
Click en **"Save"** en la parte inferior.

### Paso 5: Verificar Google OAuth Provider
1. Ve a **Authentication** > **Providers**
2. Click en **Google**
3. Verifica que esté **Enabled**
4. Verifica que el **Client ID** sea: `760210878835-9a2fj0jhtq7lh6q7e7pcnq6hvu37m86l.apps.googleusercontent.com`
5. Verifica que el **Client Secret** esté configurado

## URLs que DEBEN estar configuradas:

### Redirect URLs (Authentication > URL Configuration):
- ✅ `https://futpro.vip/auth/callback`
- ✅ `https://futpro.vip/oauth/callback`
- ✅ `http://localhost:5173/auth/callback` (desarrollo)
- ✅ `http://localhost:5173/oauth/callback` (desarrollo)

### Site URL:
- ✅ `https://futpro.vip`

## Después de configurar:

Espera 1-2 minutos para que los cambios se propaguen y prueba nuevamente el login con Google.

## Si sigue fallando:

Verifica en la consola del navegador (F12) que el `redirectTo` sea exactamente:
```
https://futpro.vip/auth/callback
```

Y que esta URL esté EXACTAMENTE en la lista de Redirect URLs de Supabase (sin espacios, sin mayúsculas diferentes).
