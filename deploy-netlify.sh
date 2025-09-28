#!/bin/bash

echo "🚀 Iniciando deployment para FutPro.vip en Netlify..."

# Configurar variables de entorno para producción
export NODE_ENV=production
export VITE_APP_URL=https://futpro.vip
export VITE_API_URL=https://futpro.vip/api
export VITE_OAUTH_CALLBACK_URL_PRODUCTION=https://futpro.vip/auth/callback
export VITE_BASE_URL_PRODUCTION=https://futpro.vip

# Mostrar configuración
echo "📋 Configuración de deployment:"
echo "  - Dominio: futpro.vip"
echo "  - OAuth Callback: https://futpro.vip/auth/callback"
echo "  - API URL: https://futpro.vip/api"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Build para producción
echo "🏗️ Construyendo aplicación para producción..."
npm run build

# Verificar archivos críticos
echo "✅ Verificando archivos críticos..."
if [ -f "dist/index.html" ]; then
    echo "  ✓ index.html generado"
else
    echo "  ❌ Error: index.html no encontrado"
    exit 1
fi

if [ -f "dist/_redirects" ]; then
    echo "  ✓ _redirects copiado"
else
    echo "  ❌ Advertencia: _redirects no encontrado"
fi

if [ -f "dist/_headers" ]; then
    echo "  ✓ _headers copiado"
else
    echo "  ❌ Advertencia: _headers no encontrado"
fi

echo "🎉 Build completado exitosamente!"
echo ""
echo "📝 CONFIGURACIONES REQUERIDAS EN SUPABASE:"
echo "  1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration"
echo "  2. Site URL: https://futpro.vip"
echo "  3. Redirect URLs: https://futpro.vip/auth/callback"
echo ""
echo "📝 CONFIGURACIONES REQUERIDAS EN GOOGLE CLOUD:"
echo "  1. Ve a: https://console.cloud.google.com/apis/credentials"
echo "  2. Authorized redirect URIs: https://futpro.vip/auth/callback"
echo ""
echo "📝 CONFIGURACIONES REQUERIDAS EN FACEBOOK DEVELOPERS:"
echo "  1. Ve a: https://developers.facebook.com/apps/1077339444513908/fb-login/settings/"
echo "  2. Valid OAuth Redirect URIs: https://futpro.vip/auth/callback"
echo ""
echo "✅ ¡Deployment listo para Netlify!"