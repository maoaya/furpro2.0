@echo off
REM Script para ejecutar SQL en Supabase via HTTP
REM Este utiliza el endpoint SQL de Supabase que está disponible en todas las cuentas

setlocal enabledelayedexpansion

set SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
set SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEzNzUyMDAsImV4cCI6MTkzNjk5NTIwMH0.9wXLHvYnQ-3RqKVBX9B4M4fRZM0GJwFNPWPsngW_L5w
set SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTM3NTIwMCwiZXhwIjoxOTM2OTk1MjAwfQ.WIa9HpMGKhXh-AH2w5JR1XqwZGGEJUEhZbKWqRJ_7lI

REM Leer el SQL desde archivo
set /p SQL=<FIX_RLS_POLICIES_FINAL.sql

REM Escapar caracteres especiales para JSON
REM (Esto es muy complicado en batch, así que usaremos un enfoque alternativo)

echo Ejecutando SQL en Supabase...

REM Usar curl con el API de SQL
curl -X POST "!SUPABASE_URL!/rest/v1/rpc/exec_sql" ^
  -H "Authorization: Bearer !SERVICE_ROLE_KEY!" ^
  -H "Content-Type: application/json" ^
  -d "{\"sql\": \"$(cat FIX_RLS_POLICIES_FINAL.sql | powershell -Command {$input | ConvertTo-Json})\"}"

echo.
echo Done!
