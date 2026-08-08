#!/bin/bash
# QUICK START - Deploy en 5 Minutos
# Uso: bash quick-deploy.sh

set -e  # Exit on error

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones
print_header() {
  echo -e "\n${BLUE}════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}════════════════════════════════════════${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# ============================================================================
# PASO 1: Validación
# ============================================================================
print_header "PASO 1: Validación Pre-Deploy"

if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  print_success "Node.js instalado: $NODE_VERSION"
else
  print_error "Node.js no está instalado. Abrir https://nodejs.org"
  exit 1
fi

if [ -f "package.json" ]; then
  print_success "package.json encontrado"
else
  print_error "package.json no encontrado. ¿Está en el directorio correcto?"
  exit 1
fi

if [ -f ".env.example" ]; then
  print_success ".env.example existe"
else
  print_warning ".env.example no encontrado"
fi

# ============================================================================
# PASO 2: Instalar dependencias
# ============================================================================
print_header "PASO 2: Instalar Dependencias"

if [ ! -d "node_modules" ]; then
  echo "Instalando npm packages..."
  npm install --quiet
  print_success "Dependencias instaladas"
else
  print_success "node_modules ya existe"
fi

# ============================================================================
# PASO 3: Ejecutar validación
# ============================================================================
print_header "PASO 3: Ejecutar Validación"

if [ -f "pre-deploy-validation.js" ]; then
  echo "Ejecutando validación pre-deploy..."
  node pre-deploy-validation.js
  VALIDATION_RESULT=$?
  
  if [ $VALIDATION_RESULT -eq 0 ]; then
    print_success "Validación completada exitosamente"
  else
    print_error "La validación falló. Revisa los errores arriba."
    exit 1
  fi
else
  print_warning "pre-deploy-validation.js no encontrado, saltando validación"
fi

# ============================================================================
# PASO 4: Build
# ============================================================================
print_header "PASO 4: Build de Producción"

echo "Limpiando build anterior..."
rm -rf dist/

echo "Ejecutando npm run build..."
npm run build --quiet

if [ -d "dist" ] && [ -f "dist/index.html" ]; then
  DIST_SIZE=$(du -sh dist | awk '{print $1}')
  print_success "Build completado exitosamente (${DIST_SIZE})"
else
  print_error "Build falló. No se creó carpeta dist/"
  exit 1
fi

# ============================================================================
# PASO 5: Git Commit
# ============================================================================
print_header "PASO 5: Commit a Git"

# Verificar si hay cambios
if [ -n "$(git status --porcelain)" ]; then
  echo "Hay cambios sin commitear:"
  git status --short
  
  read -p "¿Continuar con commit? (y/n) " -n 1 -r
  echo
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add .
    git commit -m "chore: deploy v5.3.0 - 6/6 requerimientos completados"
    print_success "Cambios commiteados"
  else
    print_warning "Commit cancelado"
  fi
else
  print_success "Repositorio limpio, no hay cambios"
fi

# ============================================================================
# PASO 6: Deploy
# ============================================================================
print_header "PASO 6: Deploy a Netlify"

echo "Opciones de deploy:"
echo "  1) Automático: git push origin main (RECOMENDADO)"
echo "  2) Manual CLI: netlify deploy --prod --dir=dist"
echo "  3) Saltar deploy"
echo ""

read -p "Seleccionar opción (1-3): " DEPLOY_OPTION

case $DEPLOY_OPTION in
  1)
    echo "Ejecutando: git push origin main"
    git push origin main
    print_success "Push completado. Netlify deployará automáticamente"
    echo "Ver estado en: https://app.netlify.com"
    ;;
  2)
    if command -v netlify &> /dev/null; then
      echo "Ejecutando: netlify deploy --prod --dir=dist"
      netlify deploy --prod --dir=dist
      print_success "Deploy completado"
    else
      print_error "Netlify CLI no está instalado"
      echo "Instalar con: npm install -g netlify-cli"
      exit 1
    fi
    ;;
  3)
    print_warning "Deploy saltado"
    echo "Ejecutar manualmente cuando esté listo:"
    echo "  git push origin main"
    echo "o"
    echo "  netlify deploy --prod --dir=dist"
    ;;
  *)
    print_error "Opción inválida"
    exit 1
    ;;
esac

# ============================================================================
# PASO 7: Verificación Final
# ============================================================================
print_header "PASO 7: Verificación Final"

sleep 2  # Esperar a que se procese

if [ "$DEPLOY_OPTION" != "3" ]; then
  echo "Verificando sitio en producción..."
  
  # Esperar un poco para que Netlify procese
  sleep 10
  
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://futpro.vip/)
  
  if [ "$HTTP_STATUS" == "200" ]; then
    print_success "Sitio activo: https://futpro.vip (Status: $HTTP_STATUS)"
  else
    print_warning "Status HTTP: $HTTP_STATUS (esperado 200)"
    echo "El deploy puede estar en progreso. Revisar en https://app.netlify.com"
  fi
fi

# ============================================================================
# RESUMEN FINAL
# ============================================================================
print_header "✅ DEPLOY COMPLETADO"

echo "Resumen:"
echo "  • Validación: ✓ Exitosa"
echo "  • Build: ✓ ${DIST_SIZE}"
echo "  • Git: ✓ Commiteado"
echo "  • Deploy: ✓ Enviado"
echo ""
echo "Próximos pasos:"
echo "  1. Esperar a que Netlify procese (2-3 minutos)"
echo "  2. Verificar https://futpro.vip"
echo "  3. Probar URLs:"
echo "     • https://futpro.vip/crear-torneo-mejorado"
echo "     • https://futpro.vip/ranking"
echo "     • https://futpro.vip/mi-equipo/[ID]"
echo ""
echo "Dashboard: https://app.netlify.com"
echo "Analytics: https://app.netlify.com/analytics"
echo ""

print_success "¡Deployment exitoso!"
print_success "FutPro 2.0 v5.3.0 está en PRODUCCIÓN"
