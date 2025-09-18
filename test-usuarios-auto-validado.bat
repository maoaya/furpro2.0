@echo off
REM Script automático con validación de respuestas
REM Inicia el servidor, espera y prueba endpoints mostrando PASA/FALLA

REM 1. Iniciar el servidor en nueva ventana
start "SpringBootServer" powershell -WindowStyle Normal -Command "cd /d %~dp0; mvn spring-boot:run; pause"

REM 2. Esperar a que el servidor arranque
echo Esperando 20 segundos para que el servidor inicie...
timeout /t 20 >nul

REM Función para validar respuesta
setlocal enabledelayedexpansion

REM 3. Pruebas de endpoints

REM Crear usuario
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios -H "Content-Type: application/json" -d "{\"nombre\":\"Juan\",\"email\":\"juan@email.com\",\"edad\":25,\"password\":\"12345678\",\"rol\":\"user\"}"') do set RESP=%%A

echo [Crear usuario] !RESP!
echo !RESP! | findstr /C:"ok":true >nul && echo PASA || echo FALLA

REM Validar email
for /f "delims=" %%A in ('curl -s "http://localhost:8080/usuarios/validar-email?email=juan@email.com"') do set RESP=%%A

echo [Validar email] !RESP!
echo !RESP! | findstr /C:"unico":false >nul && echo PASA || echo FALLA

REM Listar usuarios paginados
for /f "delims=" %%A in ('curl -s "http://localhost:8080/usuarios/paginado?page=0&size=10"') do set RESP=%%A

echo [Listar usuarios] !RESP!
echo !RESP! | findstr /C:"usuarios" >nul && echo PASA || echo FALLA

REM Obtener perfil de usuario (id=1)
for /f "delims=" %%A in ('curl -s "http://localhost:8080/usuarios/1/perfil"') do set RESP=%%A

echo [Obtener perfil] !RESP!
echo !RESP! | findstr /C:"email" >nul && echo PASA || echo FALLA

REM Actualizar perfil de usuario
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/1/perfil -H "Content-Type: application/json" -d "{\"nombre\":\"Juan Actualizado\"}"') do set RESP=%%A

echo [Actualizar perfil] !RESP!
echo !RESP! | findstr /C:"ok":true >nul && echo PASA || echo FALLA

REM Asignar rol a usuario
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/1/rol -H "Content-Type: application/json" -d "{\"rol\":\"admin\"}"') do set RESP=%%A

echo [Asignar rol] !RESP!
echo !RESP! | findstr /C:"ok":true >nul && echo PASA || echo FALLA

REM Bloquear usuario
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/1/bloquear') do set RESP=%%A

echo [Bloquear usuario] !RESP!
echo !RESP! | findstr /C:"ok":true >nul && echo PASA || echo FALLA

REM Validar dato (email)
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"email\",\"valor\":\"juan@email.com\"}"') do set RESP=%%A

echo [Validar dato email] !RESP!
echo !RESP! | findstr /C:"valido":false >nul && echo PASA || echo FALLA

REM Validar dato (usuario)
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"usuario\",\"valor\":\"Juan\"}"') do set RESP=%%A

echo [Validar dato usuario] !RESP!
echo !RESP! | findstr /C:"unico":false >nul && echo PASA || echo FALLA

REM Validar dato (password)
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"password\",\"valor\":\"12345678\"}"') do set RESP=%%A

echo [Validar dato password] !RESP!
echo !RESP! | findstr /C:"valido":true >nul && echo PASA || echo FALLA

REM Recuperar contraseña
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/recuperar -H "Content-Type: application/json" -d "{\"email\":\"juan@email.com\"}"') do set RESP=%%A

echo [Recuperar contraseña] !RESP!
echo !RESP! | findstr /C:"ok":true >nul && echo PASA || echo FALLA

REM Cambiar contraseña
for /f "delims=" %%A in ('curl -s -X PUT http://localhost:8080/usuarios/1/password -H "Content-Type: application/json" -d "{\"password\":\"nuevaClave123\"}"') do set RESP=%%A

echo [Cambiar contraseña] !RESP!
echo !RESP! | findstr /C:"ok":true >nul && echo PASA || echo FALLA

REM Reportar mensaje
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/mensajes/1/reportar -H "Content-Type: application/json" -d "{\"motivo\":\"spam\"}"') do set RESP=%%A

echo [Reportar mensaje] !RESP!
echo !RESP! | findstr /C:"ok":true >nul && echo PASA || echo FALLA

REM Enviar mensaje con adjunto (solo texto)
for /f "delims=" %%A in ('curl -s -X POST http://localhost:8080/usuarios/mensajes/adjunto -F "remitenteId=1" -F "destinatarioId=2" -F "texto=Hola!"') do set RESP=%%A

echo [Mensaje con adjunto] !RESP!
echo !RESP! | findstr /C:"ok":true >nul && echo PASA || echo FALLA

endlocal
pause
