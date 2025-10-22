@echo off
chcp 65001 >nul
echo.
echo ============================================
echo 🚀 DESPLEGAR COMMIT 3795afd A PRODUCCIÓN
echo ============================================
echo.
echo Este script desplegará el fix de navegación OAuth a futpro.vip
echo.

REM Intentar leer Build Hook guardado si existe
set BUILD_HOOK_URL=
if exist ".netlify-build-hook.txt" (
    set /p BUILD_HOOK_URL=<".netlify-build-hook.txt"
)

REM Validar URL guardada; si no es válida, forzar configuración
echo %BUILD_HOOK_URL% | findstr /R /C:"^https://api\.netlify\.com/build_hooks/" >nul
if %errorlevel% NEQ 0 (
    set BUILD_HOOK_URL=
)

if "%BUILD_HOOK_URL%"=="" (
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
    echo.
    echo 4. Configura:
    echo    - Name: Auto Deploy Script
    echo    - Branch: master
    echo.
    echo 5. Click "Save"
    echo.
    echo 6. Copia la URL generada (debe verse como:)
    echo    https://api.netlify.com/build_hooks/xxxxxxxxxxxxx
    echo.
    echo ============================================
    echo.
    set /p BUILD_HOOK_URL="Build Hook URL: "
)

REM Validar la URL ingresada
echo %BUILD_HOOK_URL% | findstr /R /C:"^https://api\.netlify\.com/build_hooks/" >nul
if %errorlevel% NEQ 0 (
    echo.
    echo ❌ ERROR: URL del Build Hook inválida o vacía
    echo.
    echo 💡 ALTERNATIVA: Deploy manual desde dashboard
    echo    1. Abre: https://app.netlify.com/sites/futprovip/deploys
    echo    2. Click en "Trigger deploy"
    echo    3. Selecciona "Clear cache and deploy site"
    echo.
    pause
    goto :end
)

REM Guardar el Build Hook para futuros usos
echo %BUILD_HOOK_URL%> .netlify-build-hook.txt
echo ✅ Build Hook guardado en .netlify-build-hook.txt
echo.

REM Llamar al script de Node.js para ejecutar el deploy
echo 📡 Triggering deploy...
node trigger-deploy.js "%BUILD_HOOK_URL%"

:end
echo.
pause
