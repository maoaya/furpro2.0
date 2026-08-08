#!/usr/bin/env pwsh
# Integrar smoke test en deploy-validated.ps1

$targetFile = 'deploy-validated.ps1'
$smokeCode = @'

    # Ejecutar smoke test automáticamente
    Write-Host '=================================' -ForegroundColor Cyan
    Write-Host 'Ejecutando smoke test...' -ForegroundColor Cyan
    Write-Host '=================================' -ForegroundColor Cyan
    $smokeScript = Join-Path (Get-Location) 'deploy-smoke.ps1'
    if (Test-Path $smokeScript) {
        try {
            & powershell -NoProfile -ExecutionPolicy Bypass -File $smokeScript -Site $deployUrl
            if ($LASTEXITCODE -eq 0) {
                Write-Host 'Smoke test: PASS' -ForegroundColor Green
            } else {
                Write-Host 'Smoke test: FAIL (revisar smoke-report.json)' -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Smoke test: ERROR ($_)" -ForegroundColor Yellow
        }
    } else {
        Write-Host 'Smoke test: SKIP (deploy-smoke.ps1 no encontrado)' -ForegroundColor DarkGray
    }
    Write-Host ''
'@

if (-not (Test-Path $targetFile)) {
    Write-Host "ERROR: $targetFile no encontrado" -ForegroundColor Red
    exit 1
}

$content = Get-Content $targetFile -Raw

# Buscar el marcador de inserción (después de la documentación)
$marker = "Write-Host '  - VALIDACION_RUTAS.md - Checklist de funcionalidad' -ForegroundColor White`n    Write-Host ''`n}"

if ($content -match [regex]::Escape($marker)) {
    $replacement = $marker.Replace("`n}", $smokeCode + "`n}")
    $newContent = $content -replace [regex]::Escape($marker), $replacement
    $newContent | Out-File -FilePath $targetFile -Encoding UTF8 -Force
    Write-Host "✓ Smoke test integrado exitosamente en $targetFile" -ForegroundColor Green
} else {
    Write-Host "ERROR: No se encontró el punto de inserción" -ForegroundColor Red
    Write-Host "Por favor, agrega manualmente el código de smoke-integration-patch.txt" -ForegroundColor Yellow
    exit 1
}
