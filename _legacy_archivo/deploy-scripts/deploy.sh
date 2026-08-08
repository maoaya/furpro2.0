#!/bin/bash

# Script de despliegue para FutPro en producción
echo "🚀 Iniciando despliegue de FutPro para producción..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Limpiar caché de Vite y build anterior
echo "🧹 Limpiando caché y build anterior..."
npm run clean
rm -rf dist/

# Construir para producción
echo "🏗️ Construyendo para producción..."
npm run build:prod

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
    echo "❌ Error: El build no se completó correctamente."
    exit 1
fi

echo "✅ Build completado exitosamente"

# Mostrar información de archivos generados
echo "📁 Archivos generados en dist/:"
ls -la dist/

echo ""
echo "🌐 URLs importantes para configurar en Supabase:"
echo "  - Sitio web: https://futpro.vip"
echo "  - OAuth callback: https://futpro.vip/auth/callback"
echo "  - Premium callback: https://futpro.vip/auth/callback-premium"
echo ""
echo "📋 Para desplegar:"
echo "  1. Copia el contenido de la carpeta 'dist/' a tu servidor web"
echo "  2. Configura el servidor para servir index.html para todas las rutas (SPA)"
echo "  3. Asegúrate de que las URLs están configuradas en Supabase OAuth"
echo ""
echo "🔧 Para probar localmente con configuración de producción:"
echo "  npm run serve:prod"

echo "✅ ¡Despliegue preparado!"