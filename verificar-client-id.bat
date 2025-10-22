@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo 🔍 VERIFICADOR DE OAUTH - CLIENT ID DETECTADO
echo ═══════════════════════════════════════════════════════════
echo.
echo 🎯 CLIENT ID EN PRODUCCIÓN (Netlify):
echo    760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf.apps.googleusercontent.com
echo.
echo 📝 NOTA: Encontré MÚLTIPLES Client IDs en tus archivos .env
echo          Pero en producción se usa el de arriba (desde .env.netlify)
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
echo.

echo 📋 VERIFICACIÓN PASO A PASO:
echo.

REM Paso 1: Google Cloud Console
echo ═══════════════════════════════════════════════════════════
echo PASO 1: Google Cloud Console
echo ═══════════════════════════════════════════════════════════
echo.
echo Abriendo Google Cloud Console...
start https://console.cloud.google.com/apis/credentials
echo.
echo ✅ VERIFICA ESTO:
echo.
echo 1. Busca en la lista de "OAuth 2.0 Client IDs" el cliente que tiene:
echo    Client ID: 760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf
echo.
echo 2. Click en el NOMBRE de ese cliente para editarlo
echo.
echo 3. En "Authorized redirect URIs", debe tener SOLO:
echo    https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
echo.
echo 4. Si tiene otras URLs (como futpro.vip/auth/callback), ELIMÍNALAS
echo.
echo 5. Click en "SAVE"
echo.
echo ═══════════════════════════════════════════════════════════
echo.
set /p GOOGLE_VERIFICADO="¿Ya verificaste y guardaste en Google? (S/N): "

if /i not "%GOOGLE_VERIFICADO%"=="S" (
    echo.
    echo ⚠️ Por favor verifica primero en Google Cloud Console.
    echo.
    pause
    exit /b
)

echo.
echo ═══════════════════════════════════════════════════════════
echo PASO 2: Supabase Dashboard
echo ═══════════════════════════════════════════════════════════
echo.
echo Abriendo Supabase...
start https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers
echo.
echo ✅ VERIFICA ESTO:
echo.
echo 1. Busca "Google" en la lista de providers
echo.
echo 2. Verifica que el Client ID sea EXACTAMENTE:
echo    760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf.apps.googleusercontent.com
echo.
echo 3. Si es diferente, CORRÍGELO con el de arriba
echo.
echo 4. Copia el Client Secret desde Google Cloud Console:
echo    - En Google, en el mismo OAuth Client, busca "Client Secret"
echo    - Click en el icono de copiar
echo    - Pega en Supabase (borra el anterior primero)
echo.
echo 5. Click en "Save"
echo.
echo ═══════════════════════════════════════════════════════════
echo.
set /p SUPABASE_VERIFICADO="¿Ya verificaste y guardaste en Supabase? (S/N): "

if /i not "%SUPABASE_VERIFICADO%"=="S" (
    echo.
    echo ⚠️ Por favor verifica primero en Supabase Dashboard.
    echo.
    pause
    exit /b
)

echo.
echo ═══════════════════════════════════════════════════════════
echo PASO 3: Esperar Propagación
echo ═══════════════════════════════════════════════════════════
echo.
echo ⏰ Google tarda 2-5 minutos en propagar cambios de OAuth.
echo.
echo ¿Ya pasaron al menos 3 minutos desde que guardaste en Google?
echo.
set /p ESPERADO="(S/N): "

if /i not "%ESPERADO%"=="S" (
    echo.
    echo ⏳ Espera 3 minutos completos y vuelve a ejecutar este script.
    echo.
    pause
    exit /b
)

echo.
echo ═══════════════════════════════════════════════════════════
echo PASO 4: Prueba en Incógnito
echo ═══════════════════════════════════════════════════════════
echo.
echo 🧪 INSTRUCCIONES PARA PROBAR:
echo.
echo 1. Abre ventana de incógnito: Ctrl + Shift + N
echo.
echo 2. Ve a: https://futpro.vip
echo.
echo 3. Abre consola (F12) y ejecuta:
echo    localStorage.clear^(^); sessionStorage.clear^(^); location.reload^(^);
echo.
echo 4. Click en "Continuar con Google"
echo.
echo 5. Selecciona tu cuenta de Google
echo.
echo 6. RESULTADO ESPERADO:
echo    ✅ Navegas a https://futpro.vip/home
echo    ✅ Ves tu dashboard
echo    ✅ NO aparece "Unable to exchange external code"
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo ¿Quieres que abra futpro.vip en incógnito ahora?
set /p ABRIR="(S/N): "

if /i "%ABRIR%"=="S" (
    echo.
    echo Abriendo en modo incógnito...
    start chrome.exe --incognito https://futpro.vip
    echo.
    echo 💡 RECUERDA:
    echo    1. Abre consola (F12)
    echo    2. Ejecuta: localStorage.clear^(^); sessionStorage.clear^(^); location.reload^(^);
    echo    3. Luego prueba el login con Google
    echo.
)

echo.
echo ═══════════════════════════════════════════════════════════
echo 📊 RESUMEN DE LA VERIFICACIÓN
echo ═══════════════════════════════════════════════════════════
echo.
echo Client ID en producción:
echo   760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf
echo.
echo Redirect URI en Google debe ser:
echo   https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
echo.
echo Redirect URLs en Supabase deben ser:
echo   https://futpro.vip/auth/callback
echo   http://localhost:5173/auth/callback
echo.
echo Si el error persiste después de esto, necesitamos:
echo   - Captura de pantalla de los redirect URIs en Google
echo   - Captura de pantalla de la config en Supabase
echo   - Response del Network tab al hacer OAuth
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
