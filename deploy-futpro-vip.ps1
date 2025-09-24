# Script de despliegue para futpro.vip
Write-Host "🚀 DESPLEGANDO FUTPRO EN PRODUCCIÓN (futpro.vip)..." -ForegroundColor Cyan

# Verificar directorio
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Ejecuta este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "📋 CHECKLIST PREVIO AL DESPLIEGUE:" -ForegroundColor Yellow
Write-Host "  ✅ Site URL en Supabase: https://futpro.vip" -ForegroundColor White
Write-Host "  ✅ Redirect URLs incluyen: https://futpro.vip/auth/callback" -ForegroundColor White
Write-Host "  ✅ Google OAuth configurado con Supabase callback" -ForegroundColor White
Write-Host "  ✅ Facebook OAuth configurado con Supabase callback" -ForegroundColor White
Write-Host ""

# Limpiar build anterior
Write-Host "🧹 Limpiando build anterior..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Build para producción
Write-Host "🏗️ Construyendo para PRODUCCIÓN (futpro.vip)..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build

# Verificar build exitoso
if (-not (Test-Path "dist\index.html")) {
    Write-Host "❌ ERROR: Build falló - no se generó index.html" -ForegroundColor Red
    exit 1
}

Write-Host "✅ BUILD COMPLETADO EXITOSAMENTE" -ForegroundColor Green

# Información de archivos
Write-Host "📁 Archivos generados:" -ForegroundColor Blue
Get-ChildItem "dist" -Recurse | Select-Object Name, Length | Format-Table

Write-Host ""
Write-Host "🌐 CONFIGURACIÓN PARA FUTPRO.VIP:" -ForegroundColor Magenta
Write-Host "1. Subir TODOS los archivos de la carpeta 'dist/' a:" -ForegroundColor White
Write-Host "   https://futpro.vip/ (raíz del dominio)" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Configurar servidor web (.htaccess para Apache):" -ForegroundColor White
Write-Host "   RewriteEngine On" -ForegroundColor Gray
Write-Host "   RewriteBase /" -ForegroundColor Gray
Write-Host "   RewriteRule ^index\.html$ - [L]" -ForegroundColor Gray
Write-Host "   RewriteCond %{REQUEST_FILENAME} !-f" -ForegroundColor Gray
Write-Host "   RewriteCond %{REQUEST_FILENAME} !-d" -ForegroundColor Gray
Write-Host "   RewriteRule . /index.html [L]" -ForegroundColor Gray
Write-Host ""
Write-Host "3. URLs a verificar después del despliegue:" -ForegroundColor White
Write-Host "   ✅ https://futpro.vip" -ForegroundColor Green
Write-Host "   ✅ https://futpro.vip/registro" -ForegroundColor Green
Write-Host "   ✅ https://futpro.vip/auth/callback" -ForegroundColor Green
Write-Host ""
Write-Host "4. Test OAuth en producción:" -ForegroundColor White
Write-Host "   - Ir a https://futpro.vip/registro" -ForegroundColor Cyan
Write-Host "   - Completar formulario" -ForegroundColor Cyan
Write-Host "   - Hacer clic en 'Continuar con Google'" -ForegroundColor Cyan
Write-Host "   - Verificar que funcione sin error 403" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎯 DETECCIÓN AUTOMÁTICA ACTIVADA:" -ForegroundColor Green
Write-Host "   El sistema detectará automáticamente que está en futpro.vip" -ForegroundColor White
Write-Host "   y usará las URLs de producción correspondientes." -ForegroundColor White
Write-Host ""

Write-Host "✅ ¡LISTO PARA DESPLEGAR EN FUTPRO.VIP!" -ForegroundColor Green