@echo off
REM Deploy automatico FutPro 2.0 - Windows Batch
REM Ejecuta el script PowerShell de deploy automatico

echo.
echo ========================================
echo  FUTPRO 2.0 - DEPLOY AUTOMATICO
echo ========================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy-auto.ps1"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  DEPLOY COMPLETADO EXITOSAMENTE
    echo ========================================
    echo  Sitio: https://futpro.vip
    echo  Dashboard: https://app.netlify.com/sites/futprovip/deploys
    echo.
) else (
    echo.
    echo ========================================
    echo  DEPLOY FALLO - Revisa deploy-netlify.log
    echo ========================================
    echo.
    type deploy-netlify.log
    echo.
)

pause
