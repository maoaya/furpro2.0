# 🚨 ERROR DE OAUTH EN PRODUCCIÓN - SOLUCIÓN INMEDIATA

## 📋 DIAGNÓSTICO DEL ERROR

**URL del error:**
```
https://futpro.vip/?error=server_error&error_code=unexpected_failure&error_description=Unable+to+exchange+external+code
```

**Código específico del error:**
```
4/0AVGzR1C7FsoP230cKID8hAg97QJ-IrN_ud2s1l2EaETwEgenQl98zbSHU3au8WTnPcZw6A
```

## 🔧 SOLUCIÓN REQUERIDA URGENTE

### **PASO 1: CONFIGURAR GOOGLE CONSOLE**

Ve inmediatamente a:
👉 **https://console.developers.google.com/apis/credentials**

1. Busca el Client ID: `760210878835-beg6ir3v4m9d7oss3koda80td4j8mifk.apps.googleusercontent.com`
2. Haz clic en el ícono de editar (lápiz)
3. En **"URIs de redirección autorizados"** AÑADE estas URLs exactas:

```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
https://futpro.vip/auth/callback
https://futpro.vip/
```

4. **¡GUARDA LOS CAMBIOS!**

### **PASO 2: VERIFICAR SUPABASE**

Ve a: **https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration**

**Site URL debe ser:**
```
https://futpro.vip
```

**Redirect URLs (una por línea):**
```
https://futpro.vip/auth/callback
https://futpro.vip/
https://futpro.vip/home
```

### **PASO 3: PROBAR INMEDIATAMENTE**

Después de configurar Google Console:
1. Espera 2-3 minutos (propagación)
2. Ve a: https://futpro.vip/
3. Prueba "Continuar con Google"

## 🔍 CAUSA RAÍZ

El error **"Unable to exchange external code"** significa que:
- ✅ Google OAuth **SÍ** está funcionando (genera el código)
- ❌ Supabase **NO PUEDE** intercambiar el código porque Google Console no tiene las URLs autorizadas
- ❌ La URL `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback` NO está en Google Console

## 📝 VERIFICACIÓN

Después de la configuración, verifica que:
1. Google Console tenga las 3 URLs exactas
2. Supabase tenga la Site URL correcta
3. El OAuth funcione sin redirección a error

**¡Esta es la configuración más crítica para el funcionamiento en producción!**