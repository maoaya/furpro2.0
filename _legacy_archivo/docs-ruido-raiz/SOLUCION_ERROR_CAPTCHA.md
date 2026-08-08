# 🔧 Solución Error CAPTCHA en Registro

## ❌ Error Actual
```
Error en registro: No se pudo crear la cuenta: captcha verification process failed
```

## 🎯 Causa del Problema
Supabase tiene habilitada la verificación de CAPTCHA para prevenir registros automáticos. Esto afecta tanto al registro por email/password como al OAuth (Google/Facebook).

## ✅ Soluciones

### Opción 1: Desactivar CAPTCHA en Supabase (RECOMENDADO)

1. Ir a **Supabase Dashboard**: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut

2. Navegar a **Authentication** → **Providers** → **Email**

3. Desactivar la opción **"Enable Captcha protection"**

4. Guardar cambios

5. Reintentar el registro

### Opción 2: Usar Netlify Function de Bypass

El proyecto ya incluye una función de Netlify que bypasea el CAPTCHA usando el Service Role Key.

**Ubicación**: `functions/signup-bypass.js`

Esta función se activa automáticamente como fallback cuando el registro normal falla.

#### Configurar Variable de Entorno en Netlify

1. Ir a **Netlify Dashboard** → Tu sitio → **Site settings** → **Environment variables**

2. Agregar:
   - **Variable**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Valor**: Tu Service Role Key de Supabase

3. Guardar y redesplegar

### Opción 3: Configurar Google reCAPTCHA v2

Si prefieres mantener el CAPTCHA:

1. Ir a https://www.google.com/recaptcha/admin

2. Crear un nuevo sitio:
   - **Label**: FutPro
   - **reCAPTCHA type**: reCAPTCHA v2
   - **Domains**: 
     - `futpro.vip`
     - `localhost`
     - `qqrxetxcglwrejtblwut.supabase.co`

3. Copiar las claves generadas

4. Ir a **Supabase Dashboard** → **Project Settings** → **Auth**

5. En **CAPTCHA Settings**, pegar:
   - **Site Key**: [Tu site key]
   - **Secret Key**: [Tu secret key]

6. Guardar cambios

## 🚀 Flujo de Registro Actual

### Con Google OAuth (RECOMENDADO)
```
Usuario completa formulario
→ Click "Continuar con Google"
→ Redirige a Google OAuth
→ Google autentica
→ Callback a /auth/callback
→ Crea perfil en Supabase
→ Muestra card de perfil
```

### Con Email/Password
```
Usuario completa formulario
→ Click "Completar Registro"
→ Intenta signup directo
→ Si falla con CAPTCHA:
   → Fallback a signup-bypass.js
   → Crea usuario con Service Role
   → Confirma email automáticamente
```

## 📋 Checklist de Verificación

- [ ] CAPTCHA desactivado en Supabase Dashboard
- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` configurada en Netlify
- [ ] Variables de OAuth configuradas correctamente
- [ ] URLs de callback autorizadas en Google Console:
  - `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`
  - `https://futpro.vip/auth/callback`
- [ ] Test de registro con Google OAuth
- [ ] Test de registro con email/password

## 🔍 Testing

Después de aplicar la solución, probar:

1. **Registro con Google**:
   - Ir a `/formulario-registro`
   - Completar todos los pasos
   - Click "Continuar con Google"
   - Verificar redirección exitosa

2. **Registro con Email** (si se implementa):
   - Completar formulario
   - Verificar que no aparezca error de CAPTCHA
   - Verificar creación de cuenta

## 📞 Soporte

Si el problema persiste:

1. Verificar logs en Netlify: https://app.netlify.com/sites/futprovip/logs
2. Verificar logs en Supabase: Dashboard → Logs → Auth Logs
3. Abrir consola del navegador (F12) para ver errores detallados
