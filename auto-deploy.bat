@echo off
chcp 65001 > nul
echo ============================================
echo 🚀 CONFIGURAR Y EJECUTAR DEPLOY AUTOMÁTICO
echo ============================================
echo.

REM Verificar si ya existe el Build Hook configurado
if defined NETLIFY_BUILD_HOOK (
    echo ✅ Build Hook encontrado
    echo URL: %NETLIFY_BUILD_HOOK%
    goto :execute
)

echo ⚙️ CONFIGURACIÓN INICIAL REQUERIDA
echo.
echo Por favor sigue estos pasos:
echo.
echo 1. Abre en tu navegador:
echo    https://app.netlify.com/sites/futprovip/settings/deploys
echo.
echo 2. Scroll hasta "Build hooks"
echo.
echo 3. Click en "Add build hook"
echo    - Name: Auto Deploy Script
echo    - Branch to build: master
echo.
echo 4. Copia la URL generada (ejemplo: https://api.netlify.com/build_hooks/xxxxx)
echo.
echo 5. Pega la URL aquí y presiona Enter:
echo.
set /p HOOK_URL="Build Hook URL: "

if "%HOOK_URL%"=="" (
    echo ❌ No se proporcionó URL
    pause
    exit /b 1
)

REM Guardar el hook en variable de entorno
setx NETLIFY_BUILD_HOOK "%HOOK_URL%" > nul
set NETLIFY_BUILD_HOOK=%HOOK_URL%

echo.
echo ✅ Build Hook guardado en variables de entorno
echo.

:execute
echo ============================================
echo 🚀 DISPARANDO DEPLOY EN NETLIFY
echo ============================================
echo.

node trigger-deploy.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Error ejecutando script
    echo.
    echo Alternativa manual:
    echo 1. Abre: https://app.netlify.com/sites/futprovip/deploys
    echo 2. Click "Trigger deploy" → "Clear cache and deploy site"
    pause
    exit /b 1
)

echo.
pause
