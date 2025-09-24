# 🚨 CONFIGURACIÓN CRÍTICA PARA PRODUCCIÓN - futpro.vip

## ❌ PROBLEMA IDENTIFICADO
Los botones de Google y Facebook no funcionan en futpro.vip porque **las URLs de callback no están configuradas correctamente** en Google Cloud Console y Facebook Developers.

## 🎯 SOLUCIÓN INMEDIATA

### 1. 📱 **Google Cloud Console** 
Ve a: https://console.cloud.google.com/
- Ve a **APIs & Services** → **Credentials**
- Edita tu OAuth 2.0 Client ID
- **Authorized JavaScript origins** debe incluir:
```
https://futpro.vip
https://www.futpro.vip
https://qqrxetxcglwrejtblwut.supabase.co
```

- **Authorized redirect URIs** debe incluir:
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
https://futpro.vip/auth/callback
https://www.futpro.vip/auth/callback
```

### 2. 📘 **Facebook Developers Console**
Ve a: https://developers.facebook.com/
- Ve a tu aplicación → **Facebook Login** → **Settings**
- **Valid OAuth Redirect URIs** debe incluir:
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
https://futpro.vip/auth/callback
https://www.futpro.vip/auth/callback
```

- **Valid domains** debe incluir:
```
qqrxetxcglwrejtblwut.supabase.co
futpro.vip
www.futpro.vip
```

### 3. ✅ **Verificación de Supabase Auth URLs**
En tu Supabase dashboard, ve a:
**Authentication** → **URL Configuration**

- **Site URL** debe ser: `https://futpro.vip`
- **Redirect URLs** debe incluir:
```
https://futpro.vip/auth/callback
https://www.futpro.vip/auth/callback
https://futpro.vip/auth/callback-premium
```

## 🔧 PASOS DE CORRECCIÓN

### PASO 1: Actualizar Google OAuth
1. Ve a Google Cloud Console
2. Busca tu proyecto OAuth
3. Edita las URLs autorizadas para incluir futpro.vip
4. Guarda los cambios

### PASO 2: Actualizar Facebook OAuth  
1. Ve a Facebook Developers
2. Edita tu aplicación
3. Actualiza las URLs de callback para incluir futpro.vip
4. Guarda los cambios

### PASO 3: Verificar Supabase
1. Ve a tu proyecto Supabase
2. Authentication → URL Configuration
3. Asegúrate que futpro.vip esté en Site URL
4. Verifica las Redirect URLs

## 🧪 VERIFICACIÓN
Después de realizar estos cambios:
1. Espera 5-10 minutos para que se propaguen
2. Prueba los botones OAuth en futpro.vip
3. Revisa la consola del navegador para errores

## 📱 URLs COMPLETAS REQUERIDAS

### Google Cloud Console - JavaScript Origins:
```
https://futpro.vip
https://www.futpro.vip
https://qqrxetxcglwrejtblwut.supabase.co
http://localhost:5173 (para desarrollo)
```

### Google Cloud Console - Redirect URIs:
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
https://futpro.vip/auth/callback
https://www.futpro.vip/auth/callback
http://localhost:5173/auth/callback (para desarrollo)
```

### Facebook Developers - OAuth Redirect URIs:
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
https://futpro.vip/auth/callback
https://www.futpro.vip/auth/callback
http://localhost:5173/auth/callback (para desarrollo)
```

### Facebook Developers - Valid Domains:
```
qqrxetxcglwrejtblwut.supabase.co
futpro.vip
www.futpro.vip
localhost (para desarrollo)
```

---
**🚨 IMPORTANTE**: Sin estos cambios, los botones OAuth nunca funcionarán en futpro.vip