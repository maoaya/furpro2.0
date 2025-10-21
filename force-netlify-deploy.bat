@echo off
echo ============================================
echo FORZAR REDEPLOY EN NETLIFY
echo ============================================
echo.

REM Verificar si existe netlify CLI
where netlify >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Netlify CLI no encontrado
    echo.
    echo Instalando Netlify CLI...
    npm install -g netlify-cli
)

echo 🔑 Autenticando en Netlify...
netlify login

echo.
echo 🚀 Forzando redeploy del sitio...
netlify deploy --prod --dir=dist

echo.
echo ✅ Deploy completado
pause
