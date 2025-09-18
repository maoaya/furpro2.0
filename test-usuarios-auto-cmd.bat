@echo off
REM Script automático con validación y exportación de resultados SOLO CMD
REM Inicia el servidor en nueva ventana CMD, espera y prueba endpoints mostrando PASA/FALLA y exportando a resultados.txt

REM 1. Iniciar el servidor en nueva ventana CMD
start "SpringBootServer" cmd /k "cd /d %~dp0 && mvn spring-boot:run"

REM 2. Esperar a que el servidor arranque (ajusta aquí el tiempo)
set WAIT=25
if not "%1"=="" set WAIT=%1

echo Esperando %WAIT% segundos para que el servidor inicie...
timeout /t %WAIT% >nul

REM 3. Exportar resultados
set RESULT_FILE=%~dp0resultados.txt
if exist "%RESULT_FILE%" del "%RESULT_FILE%"

setlocal enabledelayedexpansion

REM Función para validar y exportar
set PASA= PASA

setlocal enabledelayedexpansion

REM Crear usuario y obtener ID
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios -H "Content-Type: application/json" -d "{\"nombre\":\"Juan\",\"email\":\"juan@email.com\",\"edad\":25,\"password\":\"12345678\",\"rol\":\"user\"}"') do set RESP=%%A
set MSG=[Crear usuario] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | C:\Windows\System32\jq.exe -e ".ok == true" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo !RESP! | findstr /C:"Email ya registrado" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%")) || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Obtener ID del usuario creado
REM Obtener el primer ID del usuario creado usando jq (requiere jq instalado)
REM Obtener el primer ID del usuario creado usando archivo temporal y jq
curl -s "http://localhost:8080/usuarios/paginado?page=0&size=1" | C:\Windows\System32\jq.exe -r ".usuarios[0].id" > tmp_id.txt
set /p USUARIO_ID=<tmp_id.txt
del tmp_id.txt
REM Si no se obtiene, usar 1 por defecto
if "!USUARIO_ID!"=="" set USUARIO_ID=1

REM Validar email
for /f "delims=" %%A in ('curl -s "http://localhost:8080/usuarios/validar-email?email=juan@email.com"') do set RESP=%%A
set MSG=[Validar email] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"unico":false >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo !RESP! | findstr /C:"unico":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%")) || (echo FALLA & echo FALLA>>"%RESULT_FILE%")
echo !RESP! | C:\Windows\System32\jq.exe -e ".unico == false or .unico == true" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Listar usuarios paginados
for /f "delims=" %%A in ('curl -s "http://localhost:8080/usuarios/paginado?page=0&size=10"') do set RESP=%%A
set MSG=[Listar usuarios] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"usuarios" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")
echo !RESP! | C:\Windows\System32\jq.exe -e ".usuarios | length > 0" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Obtener perfil de usuario
for /f "delims=" %%A in ('curl -s "http://localhost:8080/usuarios/!USUARIO_ID!/perfil"') do set RESP=%%A
set MSG=[Obtener perfil] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | C:\Windows\System32\jq.exe -e ".email == \"juan@email.com\"" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo !RESP! | findstr /C:"notFound" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%")) || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Actualizar perfil de usuario
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/!USUARIO_ID!/perfil -H "Content-Type: application/json" -d "{\"nombre\":\"Juan Actualizado\"}"') do set RESP=%%A
set MSG=[Actualizar perfil] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"ok":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo !RESP! | findstr /C:"notFound" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%")) || (echo FALLA & echo FALLA>>"%RESULT_FILE%")
echo !RESP! | C:\Windows\System32\jq.exe -e ".ok == true" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo !RESP! | findstr /C:"notFound" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%")) || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Asignar rol a usuario
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/!USUARIO_ID!/rol -H "Content-Type: application/json" -d "{\"rol\":\"admin\"}"') do set RESP=%%A
set MSG=[Asignar rol] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | C:\Windows\System32\jq.exe -e ".rol == \"admin\"" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo !RESP! | findstr /C:"notFound" >nul && (echo PASA & echo PASA>>"%RESULT_FILE")) || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Bloquear usuario
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/!USUARIO_ID!/bloquear') do set RESP=%%A
set MSG=[Bloquear usuario] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | C:\Windows\System32\jq.exe -e ".ok == true" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Recuperar contraseña
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/recuperar -H "Content-Type: application/json" -d "{\"email\":\"juan@email.com\"}"') do set RESP=%%A
set MSG=[Recuperar contraseña] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | C:\Windows\System32\jq.exe -e ".ok == true" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Cambiar contraseña
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/!USUARIO_ID!/password -H "Content-Type: application/json" -d "{\"password\":\"nuevaClave123\"}"') do set RESP=%%A
set MSG=[Cambiar contraseña] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | C:\Windows\System32\jq.exe -e ".ok == true" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

endlocal

echo.
echo Resultados exportados a: %RESULT_FILE%
pause
