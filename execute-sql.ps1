# Script PowerShell para ejecutar SQL en Supabase
$SUPABASE_URL = "https://qqrxetxcglwrejtblwut.supabase.co"
$SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTM3NTIwMCwiZXhwIjoxOTM2OTk1MjAwfQ.WIa9HpMGKhXh-AH2w5JR1XqwZGGEJUEhZbKWqRJ_7lI"

# Leer el contenido SQL del archivo
$sqlContent = Get-Content -Path "FIX_RLS_POLICIES_FINAL.sql" -Raw

# Log
Write-Host "📝 Ejecutando SQL en Supabase..."
Write-Host "🔗 Endpoint: $SUPABASE_URL"
Write-Host "📊 Número de líneas SQL: $($sqlContent.Split("`n").Count)"

# Crear el body JSON de manera segura
$jsonBody = @{
    sql = $sqlContent
} | ConvertTo-Json -Depth 10

# Headers
$headers = @{
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
    "apikey" = $SERVICE_ROLE_KEY
}

try {
    # Enviar al endpoint RPC de SQL
    # (Este endpoint puede variar, intentamos varios)
    
    # Opción 1: Usar el endpoint de funciones RPC (si está disponible)
    Write-Host "`n🔄 Intentando opción 1: POST /rpc/exec_sql"
    $response = Invoke-WebRequest -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" `
        -Method POST `
        -Headers $headers `
        -Body $jsonBody `
        -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ SQL ejecutado exitosamente!"
        Write-Host "Respuesta: $($response.Content)"
    } else {
        Write-Host "⚠️ Opción 1 no disponible (esperado), intentando opción 2..."
        
        # Opción 2: Usar pgAdmin API si está disponible
        Write-Host "`n🔄 Intentando opción 2: Ejecución mediante API de Supabase"
        
        # Split SQL statements and execute individually
        $statements = $sqlContent -split ";" | Where-Object { $_.Trim() -ne "" }
        $successCount = 0
        
        foreach ($statement in $statements) {
            $trimmedStmt = $statement.Trim()
            if ($trimmedStmt -eq "") { continue }
            
            Write-Host "`n📌 Ejecutando: $($trimmedStmt.Substring(0, [Math]::Min(50, $trimmedStmt.Length)))..."
            
            # Para DROP IF EXISTS, ignorar errores
            if ($trimmedStmt -like "*DROP*" -or $trimmedStmt -like "*CREATE*") {
                Write-Host "   (Sentencia de DDL detectada)"
            }
            
            $successCount++
        }
        
        Write-Host "`n✅ Se identificaron $successCount sentencias SQL para ejecutar"
        Write-Host "`n⚠️ NOTA: Para aplicar los cambios, debe ejecutar el SQL directamente en:"
        Write-Host "   1. Supabase Dashboard: https://app.supabase.com/project/qqrxetxcglwrejtblwut"
        Write-Host "   2. SQL Editor → Ejecutar el contenido de FIX_RLS_POLICIES_FINAL.sql"
        Write-Host "   3. O usar: psql -h qqrxetxcglwrejtblwut.supabase.co -U postgres"
    }
}
catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)"
    Write-Host "`n⚠️ El script no pudo ejecutar SQL remotamente."
    Write-Host "`n📝 Alternativa: Copie el SQL a Supabase Dashboard:"
    Write-Host "   1. Vaya a https://app.supabase.com/project/qqrxetxcglwrejtblwut"
    Write-Host "   2. Seleccione 'SQL Editor' (ícono de bases de datos)"
    Write-Host "   3. Haga clic en 'New Query'"
    Write-Host "   4. Pegue el contenido de FIX_RLS_POLICIES_FINAL.sql"
    Write-Host "   5. Haga clic en 'Run'"
}

Write-Host "`n✅ Script completado"
