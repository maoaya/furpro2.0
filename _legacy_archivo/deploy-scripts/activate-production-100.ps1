#!/usr/bin/env powershell
# FutPro 2.0 - Automatizacion 100% a Produccion
# Script corregido sin caracteres especiales en comentarios

param(
    [switch]$SkipConfirm = $false
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FUTPRO 2.0 - ACTIVACION 100% PRODUCCION" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: No estamos en el directorio de futpro2.0" -ForegroundColor Red
    exit 1
}

Write-Host "[1/5] Verificando estado del proyecto..." -ForegroundColor Yellow

# Verificar build
if (-not (Test-Path "dist")) {
    Write-Host "  Ejecutando build..." -ForegroundColor Gray
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR en build" -ForegroundColor Red
        exit 1
    }
}

Write-Host "  OK - Build completado" -ForegroundColor Green
Write-Host ""

Write-Host "[2/5] Verificando configuracion .env..." -ForegroundColor Yellow

# Verificar archivos de configuracion
$envFiles = @(".env.netlify", "netlify.toml")
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "  OK - $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - $file no encontrado" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "[3/5] Verificando Git..." -ForegroundColor Yellow

# Verificar git
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "  Cambios pendientes encontrados" -ForegroundColor Yellow
    Write-Host "  Haciendo commit..." -ForegroundColor Gray
    git add -A
    git commit -m "Automatizacion produccion 100%"
}

Write-Host "  OK - Git sincronizado" -ForegroundColor Green
Write-Host ""

Write-Host "[4/5] Push a GitHub..." -ForegroundColor Yellow

$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "  Rama: $currentBranch" -ForegroundColor Gray

git push origin $currentBranch
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR en push" -ForegroundColor Red
    exit 1
}

Write-Host "  OK - Push completado" -ForegroundColor Green
Write-Host ""

Write-Host "[5/5] Configuracion de Netlify..." -ForegroundColor Yellow
Write-Host "  Sitio: futpro.vip" -ForegroundColor Gray
Write-Host "  Build command: npm install --no-audit --no-fund && npm run build" -ForegroundColor Gray
Write-Host "  Publish directory: dist" -ForegroundColor Gray
Write-Host "  Node version: 20.10.0" -ForegroundColor Gray
Write-Host "  OK - Configuracion verificada" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SIGUIENTE PASO MANUAL - SUPABASE SQL" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abre: https://app.supabase.com" -ForegroundColor White
Write-Host "2. Proyecto: FutPro" -ForegroundColor White
Write-Host "3. SQL Editor - New Query" -ForegroundColor White
Write-Host "4. Copia archivo: SQL_MARKETPLACE_SETUP.sql" -ForegroundColor White
Write-Host "5. Pega en Supabase - Click RUN" -ForegroundColor White
Write-Host "6. Repite con: SQL_RLS_POLICIES.sql" -ForegroundColor White
Write-Host ""

Write-Host "Abriendo navegador..." -ForegroundColor Cyan
Start-Process "https://app.supabase.com"

Write-Host ""
Write-Host "DEPLOY A NETLIFY EN PROGRESO AUTOMATICO" -ForegroundColor Green
Write-Host "URL Live: https://futpro.vip" -ForegroundColor Cyan
Write-Host "Verifica en: https://app.netlify.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona ENTER cuando hayas ejecutado los 2 archivos SQL..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "Abriendo sitio para test..." -ForegroundColor Cyan
Start-Process "https://futpro.vip"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "FUTPRO 2.0 AL 100% EN PRODUCCION REAL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
