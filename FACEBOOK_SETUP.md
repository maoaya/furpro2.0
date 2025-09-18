# 📘 CONFIGURACIÓN FACEBOOK LOGIN - FutPro

## 🚀 **PASOS REQUERIDOS**

### **1. Facebook Developers Console**
1. Ve a: https://developers.facebook.com/
2. Crea una nueva aplicación o usa una existente
3. Agrega el producto "Facebook Login"

### **2. Configuración OAuth Redirect URLs**
En Facebook Developers → Tu App → Facebook Login → Settings:

**Valid OAuth Redirect URIs:**
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
```

**Valid domains:**
```
qqrxetxcglwrejtblwut.supabase.co
localhost
```

### **3. Configuración en Supabase**
1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers
2. Habilita "Facebook" provider
3. Configura:
   - **Facebook App ID**: [Tu App ID de Facebook]
   - **Facebook App Secret**: [Tu App Secret de Facebook]
   - **Redirect URL**: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`

### **4. Permisos requeridos**
En Facebook App → App Review → Permissions:
- ✅ `email` (básico)
- ✅ `public_profile` (básico)
- ⚠️ Para producción: solicitar revisión de permisos

### **5. Variables de entorno** (opcional)
```env
VITE_FACEBOOK_APP_ID=tu_facebook_app_id
```

## 🔍 **INFORMACIÓN IMPORTANTE**

### **URL de Callback oficial:**
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
```

### **Dominios válidos:**
- Desarrollo: `localhost:5173`
- Producción: `tu-dominio.com`
- Supabase: `qqrxetxcglwrejtblwut.supabase.co`

### **Scopes por defecto:**
- `email`: Para obtener email del usuario
- `public_profile`: Para nombre, foto de perfil, etc.

## ✅ **VERIFICACIÓN**
1. Configurar Facebook App
2. Configurar Supabase Provider
3. Probar login en desarrollo
4. Configurar dominios de producción
