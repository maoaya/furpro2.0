# 🔐 Configuración de Google OAuth para FutPro 2.0

## 📋 Configuración Actual

### URL de Callback Configurada
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
```

### Configuración en Google Cloud Console

#### 1. 🌐 Crear Proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API** y **Google Identity API**

#### 2. 🔐 Configurar OAuth 2.0
1. Ve a **APIs & Services** → **Credentials**
2. Clic en **Create Credentials** → **OAuth 2.0 Client ID**
3. Selecciona **Web application**
4. Configurar URLs:

**Authorized JavaScript origins:**
```
http://localhost:5173
https://tu-dominio-produccion.com
https://qqrxetxcglwrejtblwut.supabase.co
```

**Authorized redirect URIs:**
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
https://tu-dominio-produccion.com/auth/callback
```

#### 3. 📝 Obtener Credenciales
- **Client ID**: Copia el Client ID generado
- **Client Secret**: Copia el Client Secret

### 🔧 Configuración en Supabase Dashboard

#### 1. Ir a Authentication Settings
1. Ve a tu [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `qqrxetxcglwrejtblwut`
3. Ve a **Authentication** → **Providers**

#### 2. Configurar Google Provider
1. Busca **Google** en la lista de providers
2. Habilita **Enable Google provider**
3. Configurar:
   - **Client ID**: `tu_google_client_id`
   - **Client Secret**: `tu_google_client_secret`
   - **Redirect URL**: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`

### 📂 Archivos Actualizados

#### AuthService.js
```javascript
async signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback',
      scopes: 'email profile'
    }
  })
}
```

#### supabase.js
```javascript
export const authConfig = {
  google: {
    callbackUrl: 'https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback',
    scopes: 'email profile'
  }
}
```

#### .env
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
```

## 🔍 Verificación y Pruebas

### 1. ✅ Verificar Configuración
```bash
# Verificar variables de entorno
echo $VITE_GOOGLE_CLIENT_ID
echo $GOOGLE_CALLBACK_URL
```

### 2. 🧪 Probar Login
1. Ejecutar aplicación en desarrollo
2. Hacer clic en "Iniciar sesión con Google"
3. Verificar redirección correcta
4. Confirmar creación de usuario en Supabase

### 3. 📊 Logs para Debug
```javascript
// En AuthService.js para debug
console.log('Google OAuth config:', {
  provider: 'google',
  redirectTo: 'https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback'
})
```

## 🚨 Troubleshooting

### Errores Comunes

#### Error: "redirect_uri_mismatch"
- **Causa**: URL de callback no coincide
- **Solución**: Verificar URLs en Google Cloud Console

#### Error: "invalid_client"
- **Causa**: Client ID o Secret incorrectos
- **Solución**: Verificar credenciales en .env y Supabase

#### Error: "unauthorized_client"
- **Causa**: Dominio no autorizado
- **Solución**: Agregar dominio a JavaScript origins

### 🔧 Debug Steps
1. Verificar configuración en Google Cloud Console
2. Confirmar provider habilitado en Supabase
3. Revisar variables de entorno
4. Probar en modo incógnito
5. Verificar logs del navegador

## 📱 Configuración para Producción

### URLs de Producción
Cuando despliegues a producción, actualizar:

```env
CORS_ORIGIN=https://tu-dominio.com
```

Y agregar a Google Cloud Console:
```
https://tu-dominio.com
https://tu-dominio.com/auth/callback
```

## 📞 Soporte
Si tienes problemas:
1. Verificar todas las URLs coincidan exactamente
2. Revisar que el proyecto de Google Cloud tenga las APIs habilitadas
3. Confirmar que Supabase tenga el provider configurado correctamente

---
*Configuración para FutPro 2.0 - Agosto 2025*
