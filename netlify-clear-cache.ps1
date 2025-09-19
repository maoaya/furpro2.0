# Requires: PowerShell 5+ 
# Usage:
#   $env:NETLIFY_AUTH_TOKEN = "<your_token>"
#   $env:NETLIFY_SITE_ID    = "<your_site_id>"
#   .\netlify-clear-cache.ps1 -Branch master

param(
  [string]$Token = $env:NETLIFY_AUTH_TOKEN,
  [string]$SiteId = $env:NETLIFY_SITE_ID,
  [string]$Branch = "master"
)

if (-not $Token) { Write-Error "NETLIFY_AUTH_TOKEN no definido (parámetro -Token o variable de entorno)."; exit 1 }
if (-not $SiteId) { Write-Error "NETLIFY_SITE_ID no definido (parámetro -SiteId o variable de entorno)."; exit 1 }

$headers = @{ Authorization = "Bearer $Token"; 'Content-Type' = 'application/json' }
$body = @{ clear_cache = $true; branch = $Branch } | ConvertTo-Json
$url = "https://api.netlify.com/api/v1/sites/$SiteId/builds"

Write-Host "Disparando build en Netlify con clear_cache=true para branch '$Branch'..." -ForegroundColor Yellow

try {
  $resp = Invoke-RestMethod -Method Post -Uri $url -Headers $headers -Body $body
  $buildId = $resp.id
  $state = $resp.state
  Write-Host "Build creado: $buildId (estado: $state)" -ForegroundColor Green
  if ($resp.deploy_id) { Write-Host "Deploy ID: $($resp.deploy_id)" }
  Write-Host "Revisa el panel de Netlify para ver el progreso del deploy." -ForegroundColor Cyan
} catch {
  Write-Error "Error al crear build en Netlify: $($_.Exception.Message)"
  if ($_.ErrorDetails.Message) { Write-Error $_.ErrorDetails.Message }
  exit 1
}
