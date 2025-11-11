#!/usr/bin/env pwsh
<#
FutPro 2.0 - Smoke Test Post-Deploy
Verifica disponibilidad básica de endpoints críticos y busca sentinelas en HTML.
Uso:
  powershell -NoProfile -ExecutionPolicy Bypass -File ./deploy-smoke.ps1 -Site https://futpro.vip
Params:
  -Site        URL base del sitio (default https://futpro.vip)
  -TimeoutSec  Timeout por request (default 12)
  -FailFast    Detener en primer fallo
Salida: resumen en consola + archivo smoke-report.json
#>
param(
  [string]$Site = 'https://futpro.vip',
  [int]$TimeoutSec = 12,
  [switch]$FailFast
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=== FUTPRO SMOKE TEST ===" -ForegroundColor Cyan
Write-Host "Base: $Site" -ForegroundColor Gray
Write-Host "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray

$targets = @(
  @{ path = '/'; expect = 'IR A REGISTRO'; label='home' }
  @{ path = '/registro-nuevo'; expect = 'formulario'; label='registro-nuevo' }
  @{ path = '/chat.html'; expect = 'Chat'; label='chat' }
  @{ path = '/videos.html'; expect = 'Video'; label='videos' }
  @{ path = '/ranking.html'; expect = 'Ranking'; label='ranking' }
  @{ path = '/privacidad.html'; expect = 'Privacidad'; label='privacidad' }
  @{ path = '/manifest.json'; expect = 'name'; label='manifest' }
)

$resultData = [System.Collections.Generic.List[object]]::new()
$overallFail = $false

function Test-Endpoint {
  param($t)
  $url = ($Site.TrimEnd('/')) + $t.path
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $resp = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec $TimeoutSec -UseBasicParsing
    $sw.Stop()
    $body = $resp.Content
    $okStatus = ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400)
    $found = $false
    if ($okStatus -and $t.expect) { $found = $body -match [Regex]::Escape($t.expect) }
    $entry = [PSCustomObject]@{
      label      = $t.label
      url        = $url
      statusCode = $resp.StatusCode
      ms         = $sw.ElapsedMilliseconds
      size       = $body.Length
      expect     = $t.expect
      expectFound= $found
      ok         = $okStatus -and ($t.expect -eq $null -or $found)
    }
    return $entry
  }
  catch {
    $sw.Stop()
    return [PSCustomObject]@{
      label      = $t.label
      url        = $url
      statusCode = -1
      ms         = $sw.ElapsedMilliseconds
      size       = 0
      expect     = $t.expect
      expectFound= $false
      ok         = $false
      error      = $_.Exception.Message
    }
  }
}

foreach($t in $targets){
  $entry = Test-Endpoint $t
  $resultData.Add($entry)
  $color = if ($entry.ok) { 'Green' } else { 'Red' }
  Write-Host ("{0,-14} {1,4} {2,6}ms ok={3} url={4}" -f $entry.label,$entry.statusCode,$entry.ms,$entry.ok,$entry.url) -ForegroundColor $color
  if (-not $entry.ok){
    $overallFail = $true
    if ($FailFast){ Write-Host 'FailFast activado -> terminando.' -ForegroundColor Yellow; break }
  }
}

# Guardar reporte
$reportPath = Join-Path (Get-Location) 'smoke-report.json'
$resultData | ConvertTo-Json -Depth 4 | Out-File -FilePath $reportPath -Encoding UTF8 -Force
Write-Host "Reporte: $reportPath" -ForegroundColor Cyan

if ($overallFail){
  Write-Host 'SMOKE TEST: FALLÓ (uno o más endpoints con error).' -ForegroundColor Red
  exit 1
}else{
  Write-Host 'SMOKE TEST: OK todos los endpoints.' -ForegroundColor Green
  exit 0
}
