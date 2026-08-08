@echo off
REM Script automático con validación y exportación de resultados
REM Inicia el servidor, espera y prueba endpoints mostrando PASA/FALLA y exportando a resultados.txt

REM 1. Iniciar el servidor en nueva ventana
start "SpringBootServer" powershell -WindowStyle Normal -Command "cd /d %~dp0; mvn spring-boot:run; pause"

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
set FALLA= FALLA

REM Crear usuario
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios -H "Content-Type: application/json" -d "{\"nombre\":\"Juan\",\"email\":\"juan@email.com\",\"edad\":25,\"password\":\"12345678\",\"rol\":\"user\"}"') do set RESP=%%A
set MSG=[Crear usuario] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"ok":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Validar email
for /f "delims=" %%A in ('curl -s "http://localhost:8080/usuarios/validar-email?email=juan@email.com"') do set RESP=%%A
set MSG=[Validar email] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"unico":false >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Listar usuarios paginados
for /f "delims=" %%A in ('curl -s "http://localhost:8080/usuarios/paginado?page=0&size=10"') do set RESP=%%A
set MSG=[Listar usuarios] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"usuarios" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Obtener perfil de usuario (id=1)
for /f "delims=" %%A in ('curl -s "http://localhost:8080/usuarios/1/perfil"') do set RESP=%%A
set MSG=[Obtener perfil] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"email" >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Actualizar perfil de usuario
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/1/perfil -H "Content-Type: application/json" -d "{\"nombre\":\"Juan Actualizado\"}"') do set RESP=%%A
set MSG=[Actualizar perfil] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"ok":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Asignar rol a usuario
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/1/rol -H "Content-Type: application/json" -d "{\"rol\":\"admin\"}"') do set RESP=%%A
set MSG=[Asignar rol] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"ok":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Bloquear usuario
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/1/bloquear') do set RESP=%%A
set MSG=[Bloquear usuario] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"ok":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Validar dato (email)
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"email\",\"valor\":\"juan@email.com\"}"') do set RESP=%%A
set MSG=[Validar dato email] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"valido":false >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Validar dato (usuario)
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"usuario\",\"valor\":\"Juan\"}"') do set RESP=%%A
set MSG=[Validar dato usuario] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"unico":false >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Validar dato (password)
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"password\",\"valor\":\"12345678\"}"') do set RESP=%%A
set MSG=[Validar dato password] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"valido":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Recuperar contraseña
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/recuperar -H "Content-Type: application/json" -d "{\"email\":\"juan@email.com\"}"') do set RESP=%%A
set MSG=[Recuperar contraseña] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"ok":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Cambiar contraseña
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/1/password -H "Content-Type: application/json" -d "{\"password\":\"nuevaClave123\"}"') do set RESP=%%A
set MSG=[Cambiar contraseña] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"ok":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Reportar mensaje
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/mensajes/1/reportar -H "Content-Type: application/json" -d "{\"motivo\":\"spam\"}"') do set RESP=%%A
set MSG=[Reportar mensaje] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"ok":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

REM Enviar mensaje con adjunto (solo texto)
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/mensajes/adjunto -F "remitenteId=1" -F "destinatarioId=2" -F "texto=Hola!"') do set RESP=%%A
set MSG=[Mensaje con adjunto] !RESP!
echo !MSG!
echo !MSG!>>"%RESULT_FILE%"
echo !RESP! | findstr /C:"ok":true >nul && (echo PASA & echo PASA>>"%RESULT_FILE%") || (echo FALLA & echo FALLA>>"%RESULT_FILE%")

endlocal

echo.
echo Resultados exportados a: %RESULT_FILE%
pause
