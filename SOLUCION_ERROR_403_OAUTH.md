# 🚨 SOLUCIÓN ERROR 403 - CONFIGURACIÓN OAUTH SUPABASE

## ❌ Problema:
Al hacer clic en "Continuar con Google", aparece:
**"403. Se trata de un error. Lo sentimos, pero no tienes acceso a esta página."**

## 🔍 Causa:
Las URLs de callback no están configuradas correctamente en Supabase.

## ✅ SOLUCIÓN PASO A PASO:

### 1. 🌐 Configurar Site URL
1. Ve a: **https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration**
2. En **"Site URL"** poner: `http://localhost:3000`
3. Hacer clic en **"Save"**

### 2. 🔗 Configurar Redirect URLs  
1. En la misma página, buscar **"Redirect URLs"**
2. Agregar estas URLs (una por línea):
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/auth/callback-premium
   http://localhost:3000/**
   ```
3. Hacer clic en **"Save"**

### 3. 🔐 Habilitar Google OAuth
1. Ve a: **https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers**
2. Buscar **"Google"**
3. Activar el toggle **"Enable sign in with Google"**
4. Configurar:
   - **Client ID**: (obtener de Google Console)
   - **Client Secret**: (obtener de Google Console)
5. Hacer clic en **"Save"**

### 4. 📋 Configurar Google Console
1. Ve a: **https://console.developers.google.com/**
2. Crear un proyecto o seleccionar existente
3. Habilitar **Google+ API**
4. Ir a **"Credentials" → "OAuth 2.0 Client IDs"**
5. En **"Authorized redirect URIs"** agregar:
   ```
   https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
   ```
6. Copiar **Client ID** y **Client Secret** a Supabase

## 🧪 PROBAR LA CONFIGURACIÓN:

### Método 1: En la consola del navegador
1. Abrir **DevTools** (F12)
2. Ir a **Console**  
3. Hacer clic en "Continuar con Google"
4. Ver logs detallados del proceso

### Método 2: Verificar URLs
1. Comprobar que Supabase muestre:
   - ✅ Site URL: `http://localhost:3000`
   - ✅ Redirect URLs incluyen: `http://localhost:3000/auth/callback`
2. Comprobar que Google Console tenga:
   - ✅ Redirect URI: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`

## 🔄 DESPUÉS DE CONFIGURAR:

1. **Reiniciar servidor** (Ctrl+C y `npm run dev`)
2. **Limpiar caché** del navegador (Ctrl+Shift+R)
3. **Ir a registro**: http://localhost:3000/registro
4. **Completar formulario** y hacer clic en "Completar Perfil"
5. **Probar Google OAuth** - debería funcionar sin error 403

## 📞 Si sigue sin funcionar:

1. Verificar en **Network tab** (DevTools) la llamada que falla
2. Revisar **Console** para mensajes de error específicos  
3. Verificar que las URLs sean exactamente las configuradas
4. Esperar unos minutos para propagación de configuración

---

## 🎯 URLs CRÍTICAS A VERIFICAR:

### En Supabase Dashboard:
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

### En Google Console:
- Authorized redirect URI: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`

**Una vez configurado esto, el OAuth debería funcionar perfectamente.** ✅