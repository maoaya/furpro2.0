@echo off
chcp 65001 > nul
title Monitor de Despliegue FutPro - Commit 9e4d0cd
color 0A

echo.
echo ============================================
echo 🚀 MONITOR DE DESPLIEGUE NETLIFY
echo ============================================
echo.
echo Commit: 9e4d0cd
echo Fix: Separar clientes Supabase (Auth vs DB)
echo Sitio: https://futpro.vip
echo.
echo ============================================
echo.

:loop
    echo [%time%] Verificando estado del despliegue...
    
    REM Verificar si el sitio responde
    curl -s -o nul -w "HTTP Status: %%{http_code}\n" https://futpro.vip
    
    if %errorlevel% equ 0 (
        echo [%time%] ✅ Sitio accesible
        
        REM Descargar y buscar señales del nuevo código
        curl -s https://futpro.vip/index.html > temp_index.html
        
        findstr /C:"supabaseAuth" temp_index.html > nul
        if %errorlevel% equ 0 (
            echo.
            echo ============================================
            echo 🎉 DESPLIEGUE COMPLETADO
            echo ============================================
            echo.
            echo ✅ El fix está LIVE en producción
            echo ✅ supabaseAuth detectado en el código
            echo ✅ Tiempo: %time%
            echo.
            echo Puedes probar el login en:
            echo https://futpro.vip
            echo.
            del temp_index.html
            pause
            exit /b 0
        ) else (
            echo [%time%] ⏳ Versión anterior aún activa - esperando build...
        )
        
        del temp_index.html
    ) else (
        echo [%time%] ❌ Error al acceder al sitio
    )
    
    echo [%time%] Esperando 30 segundos para próxima verificación...
    echo.
    timeout /t 30 /nobreak > nul
    goto loop
