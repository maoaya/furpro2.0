# 🌐 Configuración de URLs para FutPro 2.0

## URLs Principales del Proyecto

### 🗄️ Base de Datos y Autenticación
- **Supabase URL**: `https://ogm0dfdzhez3fiomlxpug.supabase.co`
- **OAuth Callback**: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`

### 🖥️ Desarrollo Local
- **Frontend (Vite)**: `http://localhost:5173`
- **Backend (Express)**: `http://localhost:3000`
- **Socket.IO**: `http://localhost:3000/socket.io`

### 🔐 URLs de Autenticación OAuth

#### Google OAuth
```javascript
redirectTo: `${window.location.origin}/auth/callback`
scopes: 'email profile'
```

#### Facebook OAuth
```javascript
callbackUrl: 'https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback'
scopes: 'email,public_profile'
```

## 🔒 Configuración SAML (No Implementada Actualmente)

### Información sobre SAML y Aserciones Cifradas

**¿Qué son las aserciones SAML cifradas?**
- SAML (Security Assertion Markup Language) es un protocolo de autenticación empresarial
- Las aserciones cifradas proporcionan una capa adicional de seguridad
- Normalmente requeridas en entornos corporativos o gubernamentales

### ⚠️ Estado Actual en FutPro 2.0
- **SAML**: ❌ No implementado
- **Aserciones Cifradas**: ❌ No implementado
- **OAuth Social**: ✅ Google y Facebook configurados
- **JWT Tokens**: ✅ Implementado con Supabase

## 📝 Configuración para Implementar SAML (Si es Necesario)

### Requisitos para SAML
1. **Proveedor de Identidad (IdP)**
   - Active Directory
   - Azure AD
   - Okta
   - Auth0

2. **Configuración en Supabase**
   - Supabase Enterprise plan requerido
   - Configuración SAML en dashboard
   - Certificados SSL

3. **URLs SAML Necesarias**
   ```
   Entity ID: https://qqrxetxcglwrejtblwut.supabase.co
   ACS URL: https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/sso/saml/acs
   Metadata URL: https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/sso/saml/metadata
   ```

### Configuración de Aserciones Cifradas
```xml
<!-- Ejemplo de configuración SAML con cifrado -->
<saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
    <saml:EncryptedAttribute>
        <!-- Datos cifrados aquí -->
    </saml:EncryptedAttribute>
</saml:Assertion>
```

## 🎯 Recomendaciones

### Para FutPro 2.0 (Aplicación Social de Fútbol)
1. **OAuth Social es Suficiente**: Google y Facebook cubren la mayoría de usuarios
2. **SAML para B2B**: Solo si planeas vender a organizaciones corporativas
3. **Seguridad Actual**: JWT + OAuth es adecuado para redes sociales

### Si Necesitas SAML
1. **Upgrade a Supabase Pro/Enterprise**
2. **Implementar SSO personalizado**
3. **Considerar Auth0 o similar para SAML**

## 🔧 Configuración de Producción

### Variables de Entorno para Producción
```env
# Producción
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
CORS_ORIGIN=https://tu-dominio-production.com
NODE_ENV=production
```

### URLs de Callback para Producción
- **Desarrollo**: `http://localhost:5173/auth/callback`
- **Producción**: `https://tu-dominio.com/auth/callback`
- **Supabase OAuth**: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`

## 📞 Soporte

¿Necesitas ayuda específica con SAML o aserciones cifradas?
- Especifica el proveedor de identidad que usas
- Indica si es para integraciones corporativas
- Describe el caso de uso específico

---
*Generado para FutPro 2.0 - Agosto 2025*
