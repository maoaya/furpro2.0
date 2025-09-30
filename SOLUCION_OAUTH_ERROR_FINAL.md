# 🚨 SOLUCIÓN PARA ERROR OAUTH: "Unable to exchange external code"

## 📋 PROBLEMA IDENTIFICADO

El error `Unable to exchange external code: 4/0AVGzR1By7zHcqkcJJ8nOBsvMUzUNOpyBvO86oeb2RouppMVrpHT0zXnjqz49EVmGR-1rAQ` indica que:

1. **Google OAuth está funcionando** (devuelve un código)
2. **Supabase no puede intercambiar el código** por un token de acceso
3. **Hay un mismatch en las URLs de redirección**

## 🔧 SOLUCIONES REQUERIDAS

### **1. CONFIGURACIÓN DE GOOGLE CONSOLE**

Ve a: https://console.developers.google.com/apis/credentials

**Client ID actual:** `760210878835-beg6ir3v4m9d7oss3koda80td4j8mifk.apps.googleusercontent.com`

**URIs de redirección autorizados que DEBES agregar:**
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
https://futpro.vip/auth/callback
https://futpro.vip
```

**¡IMPORTANTE!** Google OAuth está enviando el código a Supabase, pero las URIs no están autorizadas.

### **2. CONFIGURACIÓN DE SUPABASE**

Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration

**Site URL:**
```
https://futpro.vip
```

**Redirect URLs (una por línea):**
```
https://futpro.vip/auth/callback
https://futpro.vip/
https://futpro.vip/home
```

### **3. CONFIGURACIÓN DE NETLIFY**

Variables de entorno actualizadas:
```bash
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.F6GSIfkPgpgrcXkJU8b2PHhv-T5Lh36WSS2xdiuH-C8
VITE_GOOGLE_CLIENT_ID=760210878835-beg6ir3v4m9d7oss3koda80td4j8mifk.apps.googleusercontent.com
VITE_APP_URL=https://futpro.vip
VITE_OAUTH_CALLBACK_URL=https://futpro.vip/auth/callback
```

## 🚀 PASOS INMEDIATOS

### **PASO 1: Configurar Google Console** ⭐
1. Ve a https://console.developers.google.com/apis/credentials
2. Busca el Client ID: `760210878835-beg6ir3v4m9d7oss3koda80td4j8mifk`
3. En "URIs de redirección autorizados", agrega:
   - `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`
   - `https://futpro.vip/auth/callback`
   - `https://futpro.vip`

### **PASO 2: Configurar Supabase**
1. Ve a https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration
2. Site URL: `https://futpro.vip`
3. Redirect URLs: `https://futpro.vip/auth/callback`

### **PASO 3: Verificar deployment**
1. Redeploy en Netlify después de cambios
2. Probar OAuth en: https://futpro.vip

## 🎯 DIAGNÓSTICO DEL ERROR

El error específico indica que:
- ✅ Google genera el código correctamente
- ❌ Supabase no puede intercambiar el código porque las URLs no coinciden
- 🔄 El flujo se interrumpe en el intercambio código->token

## 📝 NOTA IMPORTANTE

Este error es común cuando:
1. Las URLs de Google Console no incluyen el endpoint de Supabase
2. El Site URL de Supabase no coincide con el dominio real
3. Hay redirects que interfieren con el flujo OAuth

Una vez configuradas las URLs correctas, el OAuth debería funcionar inmediatamente.