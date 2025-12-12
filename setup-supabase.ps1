#!/usr/bin/env pwsh
# Script para ejecutar SQL en Supabase - FutPro 2.0
# Uso: powershell -ExecutionPolicy Bypass -File setup-supabase.ps1

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   FutPro 2.0 - Setup Supabase Automático      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar que los archivos SQL existen
$sqlMarketplace = "SQL_MARKETPLACE_SETUP.sql"
$sqlPolicies = "SQL_RLS_POLICIES.sql"

if (-not (Test-Path $sqlMarketplace)) {
    Write-Host "❌ Error: No se encontró $sqlMarketplace" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $sqlPolicies)) {
    Write-Host "❌ Error: No se encontró $sqlPolicies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivos SQL encontrados:" -ForegroundColor Green
Write-Host "   • $sqlMarketplace"
Write-Host "   • $sqlPolicies"
Write-Host ""

Write-Host "⚠️  IMPORTANTE: Este script NO puede ejecutar SQL directamente." -ForegroundColor Yellow
Write-Host "   Debes copiar el contenido en Supabase Dashboard manualmente." -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 INSTRUCCIONES:" -ForegroundColor Cyan
Write-Host ""
Write-Host "PASO 1: Ejecutar SQL_MARKETPLACE_SETUP.sql" -ForegroundColor Yellow
Write-Host "  1. Abre: https://app.supabase.com" -ForegroundColor White
Write-Host "  2. Selecciona tu proyecto FutPro" -ForegroundColor White
Write-Host "  3. SQL Editor → New Query" -ForegroundColor White
Write-Host "  4. Copia el contenido de: $sqlMarketplace" -ForegroundColor White
Write-Host "  5. Pega en el editor" -ForegroundColor White
Write-Host "  6. Clickea: Run" -ForegroundColor White
Write-Host "  7. Verifica: Table Editor → debe aparecer 'marketplace_items'" -ForegroundColor White
Write-Host ""

Write-Host "PASO 2: Ejecutar SQL_RLS_POLICIES.sql" -ForegroundColor Yellow
Write-Host "  1. SQL Editor → New Query (nueva pestaña)" -ForegroundColor White
Write-Host "  2. Copia el contenido de: $sqlPolicies" -ForegroundColor White
Write-Host "  3. Pega en el editor" -ForegroundColor White
Write-Host "  4. Clickea: Run" -ForegroundColor White
Write-Host "  5. Verifica: Authentication → Policies → 20 políticas deberían aparecer" -ForegroundColor White
Write-Host ""

Write-Host "PASO 3: Después de ejecutar SQL, vuelve aquí y presiona Enter" -ForegroundColor Cyan
Read-Host "Presiona Enter cuando hayas ejecutado ambos archivos SQL"

Write-Host ""
Write-Host "🎉 ¡SQL Configurado!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. git push origin main (haz deploy a Netlify)" -ForegroundColor White
Write-Host "  2. Espera 2-3 minutos" -ForegroundColor White
Write-Host "  3. Accede a: https://futpro.vip" -ForegroundColor White
Write-Host "  4. Sigue el flujo: Categoría → Registro → OAuth → Card → HomePage" -ForegroundColor White
Write-Host ""
Write-Host "✅ ¡TODO LISTO!" -ForegroundColor Green
