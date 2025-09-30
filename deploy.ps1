# Script de despliegue para FutPro en producción (Windows PowerShell)
Write-Host "🚀 Iniciando despliegue de FutPro para producción..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encuentra package.json. Ejecuta este script desde la raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Limpiar caché de Vite y build anterior
Write-Host "🧹 Limpiando caché y build anterior..." -ForegroundColor Yellow
npm run clean
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Construir para producción
Write-Host "🏗️ Construyendo para producción..." -ForegroundColor Yellow
npm run build:prod

# Verificar que el build fue exitoso
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: El build no se completó correctamente." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completado exitosamente" -ForegroundColor Green

# Mostrar información de archivos generados
Write-Host "📁 Archivos generados en dist/:" -ForegroundColor Blue
Get-ChildItem "dist" | Format-Table Name, Length, LastWriteTime

Write-Host ""
Write-Host "🌐 URLs importantes para configurar en Supabase:" -ForegroundColor Magenta
Write-Host "  - Sitio web: https://futpro.vip" -ForegroundColor White
Write-Host "  - OAuth callback (Supabase): https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback" -ForegroundColor White
Write-Host "  - Premium callback: https://futpro.vip/auth/callback-premium" -ForegroundColor White
Write-Host ""
Write-Host "📋 Para desplegar:" -ForegroundColor Yellow
Write-Host "  1. Copia el contenido de la carpeta 'dist/' a tu servidor web" -ForegroundColor White
Write-Host "  2. Configura el servidor para servir index.html para todas las rutas (SPA)" -ForegroundColor White
Write-Host "  3. Asegúrate de que las URLs están configuradas en Supabase OAuth" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Para probar localmente con configuración de producción:" -ForegroundColor Cyan
Write-Host "  npm run serve:prod" -ForegroundColor White

Write-Host "✅ ¡Despliegue preparado!" -ForegroundColor Green