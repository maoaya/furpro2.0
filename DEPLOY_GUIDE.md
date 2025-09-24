# 🚀 Guía de Despliegue de FutPro en Producción

## 📋 Estado Actual

✅ **Sistema OAuth funcional** - Google y Facebook configurados  
✅ **Registro permanente** - Datos guardados en base de datos  
✅ **Build de producción** - Optimizado y listo  
✅ **Configuración dinámica** - Detecta entorno automáticamente  

## 🛠️ Pasos para Despliegue

### 1. Preparar Build de Producción

```bash
# Instalar dependencias
npm install

# Limpiar caché anterior
npm run clean

# Construir para producción
npm run build:prod
```

### 2. Configurar Supabase OAuth

⚠️ **CRÍTICO**: Las URLs de callback DEBEN estar configuradas en Supabase:

#### En Supabase Dashboard:
1. Ve a: `https://supabase.com/dashboard/project/[TU-PROJECT-ID]/auth/url-configuration`
2. Configura **Site URL**: `https://futpro.vip`
3. Agrega **Redirect URLs**:
   - `https://futpro.vip/auth/callback`
   - `https://futpro.vip/auth/callback-premium`

#### OAuth Providers:
1. Ve a: `https://supabase.com/dashboard/project/[TU-PROJECT-ID]/auth/providers`
2. **Google OAuth**:
   - Habilitar ✅
   - Client ID y Secret configurados
   - En Google Console, agregar: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`
3. **Facebook OAuth**:
   - Habilitar ✅
   - App ID y Secret configurados
   - En Facebook, agregar: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`

### 3. Subir al Servidor

```bash
# Copiar contenido de la carpeta 'dist/' a tu servidor web
# Asegurar que el servidor sirve index.html para todas las rutas (SPA)
```

### 4. Configuración del Servidor Web

#### Apache (.htaccess):
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Nginx:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🔍 Verificación Post-Despliegue

### URLs a verificar:
- ✅ `https://futpro.vip` - Página principal
- ✅ `https://futpro.vip/auth/callback` - Callback OAuth
- ✅ `https://futpro.vip/login` - Página de login
- ✅ `https://futpro.vip/registro` - Página de registro

### Test OAuth:
1. Ir a `https://futpro.vip/login`
2. Hacer clic en "Continuar con Google"
3. Verificar redirección correcta
4. Comprobar que el usuario se registra en la base de datos

## 🚨 Solución de Problemas

### "No avanza, no hace nada"
1. **Verificar consola del navegador** - Buscar errores JavaScript
2. **Comprobar URLs en Supabase** - Deben coincidir exactamente
3. **Verificar variables de entorno** - `.env.production` aplicado correctamente
4. **Test de conectividad** - Supabase accesible desde producción

### Comandos de diagnóstico:
```bash
# Verificar configuración de Supabase
node scripts/verificar-supabase.js

# Probar localmente con configuración de producción
npm run serve:prod
```

## 📊 Monitoreo

### Endpoints de salud:
- `https://futpro.vip/health` - Estado del servidor
- `https://futpro.vip/api/oauth-config` - Configuración OAuth

### Logs importantes:
- Errores de OAuth en consola del navegador
- Fallos de redirección
- Errores de conexión a Supabase

## 🔧 Variables de Entorno Críticas

```env
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_BASE_URL=https://futpro.vip
VITE_OAUTH_CALLBACK_URL=https://futpro.vip/auth/callback
VITE_PREMIUM_CALLBACK_URL=https://futpro.vip/auth/callback-premium
```

## ✅ Checklist Final

- [ ] Build completado sin errores
- [ ] URLs configuradas en Supabase
- [ ] OAuth providers habilitados
- [ ] Archivos subidos al servidor
- [ ] Servidor configurado para SPA
- [ ] Test OAuth funcional
- [ ] Base de datos recibiendo registros

---

**🎯 Próximo paso**: Una vez deployado, probar el flujo completo de OAuth en `https://futpro.vip` y verificar que los usuarios se registren correctamente en la base de datos.