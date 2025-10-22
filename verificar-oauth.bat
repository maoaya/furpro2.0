@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo 🔥 VERIFICADOR DE CONFIGURACIÓN OAUTH - FUTPRO
echo ═══════════════════════════════════════════════════════════
echo.
echo Este script te guiará para verificar la configuración exacta
echo que está causando el error "Unable to exchange external code"
echo.
echo ═══════════════════════════════════════════════════════════
echo.

:MENU
echo.
echo 📋 VERIFICACIÓN PASO A PASO:
echo.
echo 1. ☁️  Verificar Google Cloud Console
echo 2. 🗄️  Verificar Supabase Dashboard
echo 3. 🧪 Probar OAuth en Incógnito
echo 4. 📊 Ver documentación completa
echo 5. ❌ Salir
echo.
set /p OPTION="Selecciona una opción (1-5): "

if "%OPTION%"=="1" goto GOOGLE
if "%OPTION%"=="2" goto SUPABASE
if "%OPTION%"=="3" goto TEST
if "%OPTION%"=="4" goto DOCS
if "%OPTION%"=="5" goto END

echo.
echo ⚠️ Opción no válida
goto MENU

:GOOGLE
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo ☁️  GOOGLE CLOUD CONSOLE - CONFIGURACIÓN CRÍTICA
echo ═══════════════════════════════════════════════════════════
echo.
echo 🔍 Abriendo Google Cloud Console...
start https://console.cloud.google.com/apis/credentials
echo.
echo ✅ PASOS A SEGUIR:
echo.
echo 1. En la lista "OAuth 2.0 Client IDs", encuentra tu cliente
echo    (probablemente "Web client 1" o similar)
echo.
echo 2. Click en el nombre para EDITAR
echo.
echo 3. En "Authorized redirect URIs", verifica que tenga:
echo.
echo    ┌─────────────────────────────────────────────────────┐
echo    │ https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
echo    └─────────────────────────────────────────────────────┘
echo.
echo    ❌ NO debe tener otras URLs como:
echo       - https://futpro.vip/auth/callback
echo       - http://localhost:5173/auth/callback
echo.
echo 4. Si tiene otras URLs, ELIMÍNALAS y deja SOLO la de Supabase
echo.
echo 5. Click en "SAVE"
echo.
echo 6. ESPERA 2-3 minutos para propagación
echo.
echo ═══════════════════════════════════════════════════════════
echo.
set /p GOOGLE_OK="¿Ya verificaste y guardaste? (S/N): "

if /i "%GOOGLE_OK%"=="S" (
    echo.
    echo ✅ Perfecto! Ahora verifica Supabase...
    timeout /t 2 >nul
    goto SUPABASE
) else (
    echo.
    echo 💡 Tómate tu tiempo para verificar correctamente.
    echo    Presiona cualquier tecla para volver al menú.
    pause >nul
    goto MENU
)

:SUPABASE
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo 🗄️  SUPABASE DASHBOARD - VERIFICACIÓN
echo ═══════════════════════════════════════════════════════════
echo.
echo 🔍 Abriendo Supabase Providers...
start https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers
echo.
echo ✅ PASOS A SEGUIR:
echo.
echo 1. Busca "Google" en la lista de providers
echo.
echo 2. Verifica que esté ENABLED (✅)
echo.
echo 3. Click en "Edit" si no está configurado
echo.
echo 4. Verifica el Client ID:
echo    - Debe coincidir con el de Google Cloud Console
echo    - Sin espacios al inicio o final
echo.
echo 5. Verifica el Client Secret:
echo    - Debe coincidir con el de Google Cloud Console
echo    - Sin espacios ni saltos de línea
echo.
echo 6. Click en "Save"
echo.
echo ═══════════════════════════════════════════════════════════
echo.
timeout /t 2 >nul
echo.
echo 🔍 Abriendo Supabase URL Configuration...
start https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration
echo.
echo ✅ VERIFICA:
echo.
echo Site URL:
echo    ┌─────────────────────────┐
echo    │ https://futpro.vip      │
echo    └─────────────────────────┘
echo.
echo Redirect URLs:
echo    ┌──────────────────────────────────────────┐
echo    │ https://futpro.vip/auth/callback        │
echo    │ http://localhost:5173/auth/callback     │
echo    └──────────────────────────────────────────┘
echo.
echo ═══════════════════════════════════════════════════════════
echo.
set /p SUPABASE_OK="¿Ya verificaste y guardaste? (S/N): "

if /i "%SUPABASE_OK%"=="S" (
    echo.
    echo ✅ Perfecto! Ahora prueba el OAuth...
    timeout /t 2 >nul
    goto TEST
) else (
    echo.
    echo 💡 Tómate tu tiempo para verificar correctamente.
    echo    Presiona cualquier tecla para volver al menú.
    pause >nul
    goto MENU
)

:TEST
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo 🧪 PRUEBA DE OAUTH EN INCÓGNITO
echo ═══════════════════════════════════════════════════════════
echo.
echo ⏱️  IMPORTANTE: Antes de probar, asegúrate de haber esperado
echo    al menos 2-3 minutos desde que guardaste en Google.
echo.
set /p WAITED="¿Ya pasaron 2-3 minutos? (S/N): "

if /i "%WAITED%"=="N" (
    echo.
    echo ⏳ Google tarda en propagar los cambios de OAuth.
    echo    Espera 2-3 minutos y vuelve a intentar.
    echo.
    pause
    goto MENU
)

echo.
echo ✅ PASOS PARA PROBAR:
echo.
echo 1. Abre ventana de incógnito: Ctrl + Shift + N
echo.
echo 2. Ve a: https://futpro.vip
echo.
echo 3. Abre consola (F12) y ejecuta:
echo.
echo    localStorage.clear^(^);
echo    sessionStorage.clear^(^);
echo    location.reload^(^);
echo.
echo 4. Click en "Continuar con Google"
echo.
echo 5. Selecciona tu cuenta de Google
echo.
echo 6. Observa el resultado:
echo.
echo    ✅ Si llegas a /home ^=^> ¡FUNCIONA!
echo    ❌ Si ves "Unable to exchange" ^=^> Vuelve al paso 1
echo    ⚠️  Si vuelves a login ^=^> Espera más tiempo
echo.
echo ═══════════════════════════════════════════════════════════
echo.
set /p TEST_RESULT="¿Funcionó el OAuth? (S/N): "

if /i "%TEST_RESULT%"=="S" (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo 🎉 ¡ÉXITO! OAuth configurado correctamente
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo ✅ Tu aplicación ya puede autenticar con Google
    echo ✅ Los usuarios navegan automáticamente a /home
    echo.
    echo 📊 Recuerda:
    echo    - Siempre usa ventana de incógnito para probar
    echo    - Limpia storage antes de cada test
    echo.
    pause
    goto END
) else (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo ❌ El OAuth aún no funciona
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo 🔍 DIAGNÓSTICO:
    echo.
    echo 1. ¿Cuál fue el error exacto?
    echo    a) "Unable to exchange external code" ^=^> Config de Google
    echo    b) "redirect_uri_mismatch" ^=^> URIs mal configurados
    echo    c) "invalid_client" ^=^> Client ID/Secret incorrectos
    echo    d) Vuelve a login ^=^> Deploy no completado o espera más
    echo.
    echo 2. Revisa NUEVAMENTE:
    echo    - Google Cloud Console ^=^> SOLO URI de Supabase
    echo    - Supabase Client ID/Secret ^=^> Sin espacios
    echo    - Esperaste 2-3 minutos después de guardar
    echo.
    echo 3. Si sigue fallando, ejecuta:
    echo    node diagnostico-oauth-completo.html
    echo.
    pause
    goto MENU
)

:DOCS
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo 📊 DOCUMENTACIÓN COMPLETA
echo ═══════════════════════════════════════════════════════════
echo.
echo Abriendo documentos...
echo.
start SOLUCION_DEFINITIVA_OAUTH.md
timeout /t 1 >nul
start FIX_GOOGLE_OAUTH_EXCHANGE_ERROR.md
timeout /t 1 >nul
start diagnostico-oauth-completo.html
echo.
echo ✅ Documentos abiertos:
echo    - SOLUCION_DEFINITIVA_OAUTH.md
echo    - FIX_GOOGLE_OAUTH_EXCHANGE_ERROR.md
echo    - diagnostico-oauth-completo.html
echo.
pause
goto MENU

:END
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo 👋 Gracias por usar el verificador de OAuth
echo ═══════════════════════════════════════════════════════════
echo.
echo Si necesitas ayuda adicional, revisa:
echo - SOLUCION_DEFINITIVA_OAUTH.md
echo - https://github.com/maoaya/furpro2.0
echo.
timeout /t 3
exit
