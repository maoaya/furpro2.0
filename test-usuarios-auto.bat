@echo off
REM Script automático: inicia el servidor Spring Boot y ejecuta pruebas de endpoints

REM 1. Iniciar el servidor en una nueva ventana
start "SpringBootServer" powershell -WindowStyle Normal -Command "cd /d %~dp0; mvn spring-boot:run; pause"

REM 2. Esperar a que el servidor arranque (ajusta el tiempo si es necesario)
echo Esperando 20 segundos para que el servidor inicie...
timeout /t 20 >nul

REM 3. Ejecutar pruebas de endpoints
REM Crear usuario
curl -X POST http://localhost:8080/usuarios -H "Content-Type: application/json" -d "{\"nombre\":\"Juan\",\"email\":\"juan@email.com\",\"edad\":25,\"password\":\"12345678\",\"rol\":\"user\"}"
echo.
REM Validar email
curl "http://localhost:8080/usuarios/validar-email?email=juan@email.com"
echo.
REM Listar usuarios paginados
curl "http://localhost:8080/usuarios/paginado?page=0&size=10"
echo.
REM Obtener perfil de usuario (id=1)
curl "http://localhost:8080/usuarios/1/perfil"
echo.
REM Actualizar perfil de usuario
curl -X PUT http://localhost:8080/usuarios/1/perfil -H "Content-Type: application/json" -d "{\"nombre\":\"Juan Actualizado\"}"
echo.
REM Asignar rol a usuario
curl -X PUT http://localhost:8080/usuarios/1/rol -H "Content-Type: application/json" -d "{\"rol\":\"admin\"}"
echo.
REM Bloquear usuario
curl -X PUT http://localhost:8080/usuarios/1/bloquear
echo.
REM Validar dato (email)
curl -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"email\",\"valor\":\"juan@email.com\"}"
echo.
REM Validar dato (usuario)
curl -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"usuario\",\"valor\":\"Juan\"}"
echo.
REM Validar dato (password)
curl -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"password\",\"valor\":\"12345678\"}"
echo.
REM Recuperar contraseña
curl -X POST http://localhost:8080/usuarios/recuperar -H "Content-Type: application/json" -d "{\"email\":\"juan@email.com\"}"
echo.
REM Cambiar contraseña
curl -X PUT http://localhost:8080/usuarios/1/password -H "Content-Type: application/json" -d "{\"password\":\"nuevaClave123\"}"
echo.
REM Reportar mensaje
curl -X POST http://localhost:8080/usuarios/mensajes/1/reportar -H "Content-Type: application/json" -d "{\"motivo\":\"spam\"}"
echo.
REM Enviar mensaje con adjunto (solo texto)
curl -X POST http://localhost:8080/usuarios/mensajes/adjunto -F "remitenteId=1" -F "destinatarioId=2" -F "texto=Hola!"
echo.
REM Enviar mensaje con adjunto (con archivo)
REM curl -X POST http://localhost:8080/usuarios/mensajes/adjunto -F "remitenteId=1" -F "destinatarioId=2" -F "texto=Archivo adjunto" -F "archivo=@ruta\al\archivo.txt"
echo.

pause
