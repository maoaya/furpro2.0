# 🌐 CONFIGURACIÓN OBLIGATORIA PARA FUTPRO.VIP

## ⚠️ ANTES DE DESPLEGAR EN PRODUCCIÓN:

### 1. 🔧 CONFIGURAR SUPABASE PARA FUTPRO.VIP

#### Site URL:
```
https://futpro.vip
```

#### Redirect URLs (AGREGAR TODAS):
```
https://futpro.vip/auth/callback
https://futpro.vip/auth/callback-premium
https://futpro.vip/**
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback-premium
http://localhost:3000/**
```

#### URLs en Dashboard:
- Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration
- Configurar ambos entornos (desarrollo Y producción)

### 2. 🔐 GOOGLE OAUTH PARA PRODUCCIÓN

#### En Google Console:
```
https://console.developers.google.com/
```

#### Authorized redirect URIs (AGREGAR):
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
```

#### Authorized JavaScript origins (AGREGAR):
```
https://futpro.vip
```

### 3. 📱 FACEBOOK OAUTH PARA PRODUCCIÓN

#### En Facebook Developers:
```
https://developers.facebook.com/
```

#### Valid OAuth Redirect URIs (AGREGAR):
```
https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
```

#### App Domains (AGREGAR):
```
futpro.vip
```

### 4. 🚀 DESPLEGAR EN FUTPRO.VIP

#### Comando de build:
```bash
npm run build:prod
```

#### Archivos a subir:
- Todo el contenido de la carpeta `dist/`
- Subir a la raíz del dominio futpro.vip

#### Configuración del servidor web:
```apache
# .htaccess para Apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

```nginx
# Para Nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🧪 VERIFICACIÓN POST-DESPLIEGUE:

### URLs a probar:
1. `https://futpro.vip` - Página principal
2. `https://futpro.vip/registro` - Registro con OAuth
3. `https://futpro.vip/auth/callback` - Callback OAuth

### Test OAuth en producción:
1. Ir a `https://futpro.vip/registro`
2. Completar formulario
3. Hacer clic en "Continuar con Google"
4. Verificar que funcione sin errores 403

## 📊 MONITOREO:

### En consola del navegador:
```
🔍 VERIFICANDO CONEXIÓN EN: PRODUCCIÓN (futpro.vip)
✅ CONEXIÓN A SUPABASE VERIFICADA
🎯 URLs configuradas para: PRODUCCIÓN
📍 Callback URL: https://futpro.vip/auth/callback
```

### En caso de error:
- Verificar que todas las URLs estén en Supabase
- Comprobar configuración de Google/Facebook
- Revisar logs de Supabase en tiempo real

---

## 🎯 CHECKLIST FINAL:

- [ ] Site URL configurada: `https://futpro.vip`
- [ ] Redirect URLs agregadas para futpro.vip
- [ ] Google OAuth con redirect URI de Supabase
- [ ] Facebook OAuth con redirect URI de Supabase
- [ ] Build de producción completado
- [ ] Archivos subidos a futpro.vip
- [ ] Servidor configurado para SPA
- [ ] Test OAuth en producción exitoso

**Una vez completado este checklist, el sistema funcionará perfectamente en futpro.vip** 🚀