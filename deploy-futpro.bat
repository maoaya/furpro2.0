@echo off
cls
echo 🚀 DEPLOY FUTPRO A FUTPRO.VIP
echo ================================
echo.

echo 📦 Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
)

echo.
echo 🔨 Construyendo proyecto...
call npx vite build

if errorlevel 1 (
    echo ❌ Error en build
    pause
    exit /b 1
)

echo.
echo ✅ BUILD EXITOSO!
echo.

if exist "dist" (
    echo 📁 Archivos generados en dist/:
    dir dist /b
    echo.
    echo 🚀 SIGUIENTE PASO:
    echo 1. Ve a: https://app.netlify.com/sites/futprovip/deploys
    echo 2. Arrastra la carpeta 'dist' completa al area de deploy
    echo 3. Espera que termine el deploy
    echo.
    echo 🔧 VERIFICAR EN SUPABASE:
    echo - Site URL: https://futpro.vip
    echo - Redirect URLs: https://futpro.vip/auth/callback
    echo.
    echo 📊 VARIABLES EN NETLIFY:
    echo - VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
    echo - VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    echo - VITE_APP_URL=https://futpro.vip
) else (
    echo ❌ No se generó la carpeta dist
)

echo.
pause