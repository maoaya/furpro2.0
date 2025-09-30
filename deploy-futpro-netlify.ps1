# PowerShell script para deployment de FutPro.vip en Netlify
# deploy-futpro-netlify.ps1

Write-Host "🚀 Iniciando deployment para FutPro.vip en Netlify..." -ForegroundColor Green

# Configurar variables de entorno para producción
$env:NODE_ENV = "production"
$env:VITE_APP_URL = "https://futpro.vip"
$env:VITE_API_URL = "https://futpro.vip/api"
$env:VITE_OAUTH_CALLBACK_URL_PRODUCTION = "https://futpro.vip/auth/callback"
$env:VITE_BASE_URL_PRODUCTION = "https://futpro.vip"

Write-Host "📋 Configuración de deployment:" -ForegroundColor Yellow
Write-Host "  - Dominio: futpro.vip" -ForegroundColor White
Write-Host "  - OAuth Callback: https://futpro.vip/auth/callback" -ForegroundColor White
Write-Host "  - API URL: https://futpro.vip/api" -ForegroundColor White

# Verificar Node.js y npm
Write-Host "🔍 Verificando dependencias..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "  ✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error: Node.js o npm no están instalados" -ForegroundColor Red
    exit 1
}

# Limpiar caché
Write-Host "🧹 Limpiando caché..." -ForegroundColor Yellow
npm cache clean --force

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
    exit 1
}

# Build para producción
Write-Host "🏗️ Construyendo aplicación para producción..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en build" -ForegroundColor Red
    exit 1
}

# Verificar archivos críticos
Write-Host "✅ Verificando archivos críticos..." -ForegroundColor Yellow

if (Test-Path "dist/index.html") {
    Write-Host "  ✅ index.html generado" -ForegroundColor Green
} else {
    Write-Host "  ❌ Error: index.html no encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path "dist/_redirects") {
    Write-Host "  ✅ _redirects copiado" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ Advertencia: _redirects no encontrado" -ForegroundColor Yellow
}

if (Test-Path "dist/_headers") {
    Write-Host "  ✅ _headers copiado" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ Advertencia: _headers no encontrado" -ForegroundColor Yellow
}

# Verificar tamaño del build
$distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "  📊 Tamaño del build: $([math]::Round($distSize, 2)) MB" -ForegroundColor Cyan

Write-Host "🎉 Build completado exitosamente!" -ForegroundColor Green
Write-Host ""

Write-Host "📝 CONFIGURACIONES REQUERIDAS EN SUPABASE:" -ForegroundColor Yellow
Write-Host "  1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration" -ForegroundColor White
Write-Host "  2. Site URL: https://futpro.vip" -ForegroundColor White
Write-Host "  3. Redirect URLs: https://futpro.vip/auth/callback" -ForegroundColor White
Write-Host ""

Write-Host "📝 CONFIGURACIONES REQUERIDAS EN GOOGLE CLOUD:" -ForegroundColor Yellow
Write-Host "  1. Ve a: https://console.cloud.google.com/apis/credentials" -ForegroundColor White
Write-Host "  2. Authorized redirect URIs: https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback" -ForegroundColor White
Write-Host ""

Write-Host "📝 CONFIGURACIONES REQUERIDAS EN FACEBOOK DEVELOPERS:" -ForegroundColor Yellow
Write-Host "  1. Ve a: https://developers.facebook.com/apps/1077339444513908/fb-login/settings/" -ForegroundColor White
Write-Host "  2. Valid OAuth Redirect URIs: https://futpro.vip/auth/callback" -ForegroundColor White
Write-Host ""

Write-Host "📝 VARIABLES DE ENTORNO EN NETLIFY DASHBOARD:" -ForegroundColor Yellow
Write-Host "  VITE_SUPABASE_URL = https://qqrxetxcglwrejtblwut.supabase.co" -ForegroundColor White
Write-Host "  VITE_SUPABASE_ANON_KEY = [tu-anon-key]" -ForegroundColor White
Write-Host "  VITE_GOOGLE_CLIENT_ID = 760210878835-2beijt9lbg88q1139admgklb69f4s2a4.apps.googleusercontent.com" -ForegroundColor White
Write-Host "  VITE_FACEBOOK_CLIENT_ID = 1077339444513908" -ForegroundColor White
Write-Host "  VITE_APP_URL = https://futpro.vip" -ForegroundColor White
Write-Host ""

Write-Host "🚀 COMANDOS PARA NETLIFY CLI:" -ForegroundColor Yellow
Write-Host "  netlify login" -ForegroundColor White
Write-Host "  netlify deploy --prod --dir=dist" -ForegroundColor White
Write-Host ""

Write-Host "✅ ¡Deployment listo para Netlify!" -ForegroundColor Green