@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ═══════════════════════════════════════════════════════════
echo   🚀 MONITOR DE DEPLOY - COMMIT 900e758
echo ═══════════════════════════════════════════════════════════
echo.
echo 📦 Commit: 900e758
echo 🎯 Fix: exchangeCodeForSession + eliminar duplicados
echo 🌐 Dominio: https://futpro.vip
echo.
echo ⏳ Monitoreando deploy de Netlify...
echo.

set /a intentos=0
set /a max_intentos=20

:loop
set /a intentos+=1
echo [Intento !intentos!/!max_intentos!] Verificando producción...

curl -s "https://futpro.vip/" | findstr /C:"900e758" >nul 2>&1
if !errorlevel! equ 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo   ✅ DEPLOY EXITOSO - Commit 900e758 detectado
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo 🎉 El nuevo código está en producción en https://futpro.vip
    echo.
    echo 📋 PRÓXIMOS PASOS:
    echo.
    echo 1. Abrir https://futpro.vip en modo incógnito
    echo 2. Hacer clic en "Continuar con Google"
    echo 3. Seleccionar tu cuenta de Google
    echo 4. Debe navegar automáticamente a /home
    echo.
    echo 🔍 En DevTools Console buscar:
    echo    "✅ Sesión establecida con exchangeCodeForSession"
    echo    "🎯 FORZANDO NAVEGACIÓN DIRECTA A /HOME"
    echo.
    echo ⚠️ Si el error persiste, verifica:
    echo    - Client Secret en Supabase Dashboard (sin espacios)
    echo    - Redirect URIs en Google Cloud Console
    echo    - Esperar 3-5 minutos después de cambios
    echo.
    pause
    exit /b 0
)

timeout /t 30 /nobreak >nul
if !intentos! geq !max_intentos! (
    echo.
    echo ⌛ Timeout: Se alcanzó el máximo de intentos (!max_intentos!)
    echo.
    echo 📝 El deploy puede tomar más tiempo. Verifica manualmente:
    echo    https://app.netlify.com/sites/futpro-vip/deploys
    echo.
    echo O ejecuta este script nuevamente en unos minutos.
    echo.
    pause
    exit /b 1
)

goto loop
