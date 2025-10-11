@echo off
echo.
echo ========================================
echo 🔧 TEST NAVEGACION CREAR USUARIO - DIAGNOSTICO COMPLETO
echo ========================================
echo.

echo 📍 Abriendo futpro.vip para probar el boton...
start https://futpro.vip

timeout /t 3 /nobreak > nul

echo.
echo 📋 INSTRUCCIONES PASO A PASO:
echo.
echo 1. En la ventana que se abrio, busca el boton azul "Crear Usuario"
echo 2. Haz click en el boton
echo 3. OBSERVA si navega a una pagina de registro
echo 4. Si NO navega, presiona F12 para abrir Developer Tools
echo 5. Ve a la pestaña "Console"
echo 6. Busca mensajes que empiecen con 🚀 o ❌
echo.

pause

echo.
echo 📍 Ahora probando acceso DIRECTO a la pagina de registro...
start https://futpro.vip/registro-nuevo

timeout /t 3 /nobreak > nul

echo.
echo 📋 RESULTADO DEL ACCESO DIRECTO:
echo.
echo Si se abrio la pagina de registro = ✅ La ruta existe
echo Si muestra error 404 = ❌ Problema de routing
echo Si se ve la pagina pero vacia = ⚠️ Problema de carga
echo.

pause

echo.
echo 🔧 Abriendo herramienta de diagnostico avanzado...
start https://futpro.vip/test-navegacion-rapido.html

timeout /t 3 /nobreak > nul

echo.
echo 📋 USA LA HERRAMIENTA DE DIAGNOSTICO:
echo.
echo 1. Haz click en "Test: Simular Click Crear Usuario"
echo 2. Observa los mensajes en la caja negra
echo 3. Haz click en "🚨 REDIRECCION FORZADA" si lo anterior no funciona
echo 4. Reporta cualquier mensaje de error que veas
echo.

pause

echo.
echo ========================================
echo 💡 POSIBLES SOLUCIONES
echo ========================================
echo.
echo Si el boton NO navega:
echo   👉 Hay problema con React Router o JavaScript
echo.
echo Si el acceso directo NO funciona:
echo   👉 Hay problema con Netlify routing
echo.
echo Si la herramienta muestra errores:
echo   👉 Hay problema con el codigo JavaScript
echo.
echo ========================================
echo.

pause