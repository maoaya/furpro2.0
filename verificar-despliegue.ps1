# PowerShell Script para verificar el despliegue de Netlify
# OAuth Fix Deployment Verification

Write-Host "🚀 VERIFICACIÓN DE DESPLIEGUE OAUTH FIX" -ForegroundColor Yellow
Write-Host "=" * 50 -ForegroundColor Yellow

# Información del commit
Write-Host "`n📊 ESTADO DEL COMMIT:" -ForegroundColor Green
Write-Host "Commit: 18422fd" -ForegroundColor White
Write-Host "Mensaje: OAuth configuration and registration flow complete - Ready for Netlify deploy" -ForegroundColor White
Write-Host "Hora: $(Get-Date)" -ForegroundColor White

# Verificar conectividad
Write-Host "`n🌐 VERIFICANDO CONECTIVIDAD:" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "https://futpro.vip/" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Sitio accesible - Código: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error de conectividad: $($_.Exception.Message)" -ForegroundColor Red
}

# Enlaces útiles
Write-Host "`n🔗 ENLACES IMPORTANTES:" -ForegroundColor Green
Write-Host "• Sitio principal: https://futpro.vip/" -ForegroundColor Cyan
Write-Host "• Netlify Dashboard: https://app.netlify.com/sites/futprovip/deploys" -ForegroundColor Cyan
Write-Host "• GitHub Repo: https://github.com/maoaya/furpro2.0" -ForegroundColor Cyan

# Instrucciones de prueba
Write-Host "`n🧪 PASOS PARA PROBAR OAUTH:" -ForegroundColor Green
Write-Host "1. Ir a https://futpro.vip/" -ForegroundColor White
Write-Host "2. Hacer clic en 'Continuar con Google'" -ForegroundColor White
Write-Host "3. Verificar que NO aparece 'Unable to exchange external code'" -ForegroundColor White
Write-Host "4. Confirmar que después del login redirecciona a /home" -ForegroundColor White

# Abrir enlaces automáticamente
Write-Host "`n🚀 ABRIENDO ENLACES..." -ForegroundColor Yellow
Start-Process "https://futpro.vip/"
Start-Sleep 2
Start-Process "https://app.netlify.com/sites/futprovip/deploys"

Write-Host "`n✅ Script completado. Los enlaces se han abierto en tu navegador." -ForegroundColor Green
Write-Host "Espera 2-3 minutos para que Netlify complete el despliegue." -ForegroundColor Yellow

# Mantener ventana abierta
Read-Host "Presiona Enter para cerrar"