@echo off
REM Script para probar endpoints de UsuarioController
REM Ejecuta cada prueba y muestra el resultado

REM 1. Crear usuario
curl -X POST http://localhost:8080/usuarios -H "Content-Type: application/json" -d "{\"nombre\":\"Juan\",\"email\":\"juan@email.com\",\"edad\":25,\"password\":\"12345678\",\"rol\":\"user\"}"
echo.
REM 2. Validar email
curl "http://localhost:8080/usuarios/validar-email?email=juan@email.com"
echo.
REM 3. Listar usuarios paginados
curl "http://localhost:8080/usuarios/paginado?page=0&size=10"
echo.
REM 4. Obtener perfil de usuario (id=1)
curl "http://localhost:8080/usuarios/1/perfil"
echo.
REM 5. Actualizar perfil de usuario
curl -X PUT http://localhost:8080/usuarios/1/perfil -H "Content-Type: application/json" -d "{\"nombre\":\"Juan Actualizado\"}"
echo.
REM 6. Asignar rol a usuario
curl -X PUT http://localhost:8080/usuarios/1/rol -H "Content-Type: application/json" -d "{\"rol\":\"admin\"}"
echo.
REM 7. Bloquear usuario
curl -X PUT http://localhost:8080/usuarios/1/bloquear
echo.
REM 8. Validar dato (email)
curl -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"email\",\"valor\":\"juan@email.com\"}"
echo.
REM 9. Validar dato (usuario)
curl -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"usuario\",\"valor\":\"Juan\"}"
echo.
REM 10. Validar dato (password)
curl -X POST http://localhost:8080/usuarios/validar -H "Content-Type: application/json" -d "{\"tipo\":\"password\",\"valor\":\"12345678\"}"
echo.
REM 11. Recuperar contraseña
curl -X POST http://localhost:8080/usuarios/recuperar -H "Content-Type: application/json" -d "{\"email\":\"juan@email.com\"}"
echo.
REM 12. Cambiar contraseña
curl -X PUT http://localhost:8080/usuarios/1/password -H "Content-Type: application/json" -d "{\"password\":\"nuevaClave123\"}"
echo.
REM 13. Reportar mensaje
curl -X POST http://localhost:8080/usuarios/mensajes/1/reportar -H "Content-Type: application/json" -d "{\"motivo\":\"spam\"}"
echo.
REM 14. Enviar mensaje con adjunto (solo texto)
curl -X POST http://localhost:8080/usuarios/mensajes/adjunto -F "remitenteId=1" -F "destinatarioId=2" -F "texto=Hola!"
echo.
REM 15. Enviar mensaje con adjunto (con archivo)
REM curl -X POST http://localhost:8080/usuarios/mensajes/adjunto -F "remitenteId=1" -F "destinatarioId=2" -F "texto=Archivo adjunto" -F "archivo=@ruta\al\archivo.txt"
echo.

pause
