@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════════════════════════
echo   🔥 FIX CLIENT SECRET - SOLUCIÓN DEFINITIVA
echo ═══════════════════════════════════════════════════════════════════
echo.
echo El error "Unable to exchange external code" significa que el
echo Client Secret en Supabase NO coincide con el de Google.
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   PASO 1: OBTENER CLIENT SECRET DE GOOGLE
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Abriendo Google Cloud Console...
start https://console.cloud.google.com/apis/credentials?project=futpro-440302
echo.
echo 📋 INSTRUCCIONES:
echo.
echo 1. Busca el OAuth Client ID:
echo    760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf
echo.
echo 2. Haz clic en el NOMBRE (no en el ID)
echo.
echo 3. En la pantalla de detalles, busca "Client Secret"
echo.
echo 4. Haz clic en el ícono de COPIAR 📋 junto al Client Secret
echo.
echo 5. ⚠️ IMPORTANTE: NO copies manualmente, usa el botón de copiar
echo.
pause
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   PASO 2: PEGAR CLIENT SECRET EN SUPABASE
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Abriendo Supabase Dashboard...
start https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers
echo.
echo 📋 INSTRUCCIONES:
echo.
echo 1. Busca "Google" en la lista de providers
echo.
echo 2. Haz clic en Google para expandir
echo.
echo 3. Verifica que esté ENABLED (toggle verde)
echo.
echo 4. En "Google Client ID" debe estar:
echo    760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf.apps.googleusercontent.com
echo.
echo 5. En "Google Client Secret":
echo    - Borra TODO lo que esté ahí
echo    - Haz clic derecho → Paste (pegar el secret de Google)
echo    - ⚠️ Verifica que NO tenga espacios al inicio o final
echo.
echo 6. Haz clic en "Save" (botón verde abajo)
echo.
pause
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   PASO 3: ESPERAR PROPAGACIÓN
echo ═══════════════════════════════════════════════════════════════════
echo.
echo ⏰ Espera 3 minutos para que Google propague los cambios...
echo.
timeout /t 180 /nobreak
echo.
echo ✅ Tiempo de espera completado
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   PASO 4: PROBAR LOGIN
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Abriendo herramienta de diagnóstico...
start https://futpro.vip/diagnostico-oauth-live.html
echo.
echo 📋 INSTRUCCIONES FINALES:
echo.
echo 1. Haz clic en "🧹 Limpiar TODO (Storage + Cookies)"
echo.
echo 2. Haz clic en "🔐 Probar Login con Google"
echo.
echo 3. Selecciona tu cuenta
echo.
echo 4. Si funciona: Verás "✅ Sesión establecida"
echo.
echo 5. Si falla: Copia el error y pásalo
echo.
pause
