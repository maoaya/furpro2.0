#!/bin/bash
# Script para redeploy después de configurar OAuth

echo "🚀 REDEPLOY FUTPRO.VIP CON CONFIGURACIÓN OAUTH CORREGIDA"
echo "======================================================="

echo "📋 CHECKLIST ANTES DEL DEPLOY:"
echo "1. ✅ ¿Configuraste las URIs en Google Console?"
echo "   - https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback"
echo "   - https://futpro.vip/auth/callback"
echo "   - https://futpro.vip"

echo "2. ✅ ¿Configuraste las URLs en Supabase?"
echo "   Site URL: https://futpro.vip"
echo "   Redirect URLs: https://futpro.vip/auth/callback"

echo "3. ✅ ¿Variables de entorno en Netlify actualizadas?"

read -p "¿Todos los pasos están completados? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🔄 Iniciando redeploy..."
    
    # Limpiar caché
    npm run clean
    
    # Build optimizado
    npm run build:prod
    
    echo "✅ Build completado"
    echo "🌐 Sitio se actualizará en: https://futpro.vip"
    echo "🔄 Tiempo estimado: 2-3 minutos"
    
    echo ""
    echo "🧪 DESPUÉS DEL DEPLOY, PROBAR:"
    echo "1. Ir a: https://futpro.vip"
    echo "2. Hacer clic en 'Iniciar con Google'"
    echo "3. Verificar que NO aparezca el error 'Unable to exchange external code'"
    
else
    echo "❌ Por favor completa la configuración antes del deploy"
    echo "📖 Revisa: SOLUCION_OAUTH_ERROR_FINAL.md"
fi