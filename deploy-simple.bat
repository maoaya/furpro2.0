@echo off
echo 🚀 Desplegando FutPro a futpro.vip
echo.

echo 📦 Instalando dependencias...
call npm install --force

echo 🔨 Construyendo proyecto...
call npm run build

if errorlevel 1 (
    echo ❌ Error en build. Abortando...
    pause
    exit /b 1
)

echo ✅ Build exitoso!
echo 📋 Para desplegar manualmente:
echo 1. Ve a https://app.netlify.com/sites/futpro/deploys
echo 2. Arrastra la carpeta 'dist' al area de deploy
echo 3. O usa: netlify deploy --prod --dir=dist
echo.

if exist dist (
    echo 📁 Archivos generados en dist/:
    dir dist /b
    echo.
    echo 🌐 Recuerda verificar en Supabase:
    echo - Site URL: https://futpro.vip
    echo - Redirect URLs: https://futpro.vip/auth/callback
    echo.
) else (
    echo ❌ Carpeta dist/ no encontrada
)

pause