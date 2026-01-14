# 🚀 GUÍA DEPLOY PRODUCCIÓN - FutPro 2.0

**Versión:** 5.3.0  
**Fecha:** 14 de enero 2026  
**Estado:** Listo para producción

---

## ⚠️ PRE-REQUISITOS

Asegurate de tener:
- ✅ Todos los 6 requerimientos completados
- ✅ `node` >= 16.0.0
- ✅ `npm` >= 8.0.0
- ✅ Netlify CLI instalado: `npm install -g netlify-cli`
- ✅ Git configurado
- ✅ Acceso a Netlify/GitHub

---

## 📋 CHECKLIST PRE-DEPLOY

### 1. Validación Local
```bash
# Ejecutar script de validación
node pre-deploy-validation.js
```

**Debe mostrar:**
```
✓ Passed: 45+
✗ Failed: 0
🎉 ALL VALIDATIONS PASSED - READY FOR DEPLOYMENT!
```

### 2. Build Local
```bash
# Limpiar build anterior
rm -rf dist

# Crear build de producción
npm run build
```

**Resultado esperado:**
```
✓ 1234 modules transformed
✓ built in 45.23s
dist/index.html 45.12 kB
```

### 3. Verificar Build
```bash
# Listar archivos en dist
ls -la dist/

# Verificar tamaño total
du -sh dist/
```

**Debe contener:**
- `index.html`
- `assets/` (carpeta con CSS/JS)
- `manifest.json`

### 4. Testing Rápido
```bash
# Ejecutar tests (opcional pero recomendado)
npm test -- --watchAll=false

# O tests específicos
npx jest testing/CrearTorneoMejorado.test.jsx --runInBand
```

---

## 🔐 VERIFICAR VARIABLES DE ENTORNO

### En Supabase Dashboard:
1. Ir a Settings → API
2. Verificar que existen:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_CLIENT_ID`

### En Netlify:
1. Ir a Site settings → Build & deploy → Environment
2. Agregar variables si no existen:
```
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_GOOGLE_CLIENT_ID=760210878835-...
VITE_AUTO_CONFIRM_SIGNUP=true
```

---

## 📱 VERIFICAR EN DESARROLLO

### Probar URLs locales:
```bash
# En terminal 1: Servidor Vite
npm run dev
# Abre http://localhost:5173

# En terminal 2 (opcional): Backend Express
npm start
# Runs on http://localhost:8080
```

### Testing en navegador:
1. ✅ `/crear-torneo-mejorado` - ¿Carga wizard?
2. ✅ `/ranking` - ¿Se cargan equipos?
3. ✅ `/mi-equipo/[ID]` - ¿Se muestra plantilla?
4. ✅ Login/Registro funciona?
5. ✅ Streaming features disponibles?

---

## 🎯 OPCIONES DE DEPLOY

### OPCIÓN A: Deploy Automático (RECOMENDADO)

```bash
# 1. Hacer commit
git add .
git commit -m "chore: deploy v5.3.0 - 6/6 requerimientos completados"

# 2. Push a rama principal
git push origin main

# 3. Netlify detecta automáticamente y deploya
# Ver en: https://app.netlify.com
```

**Tiempo:** 2-3 minutos  
**Manual:** Ninguno  
**Rollback:** Automático a commit anterior

---

### OPCIÓN B: Deploy Manual Netlify CLI

```bash
# 1. Login en Netlify
netlify login

# 2. Link con sitio (si no está hecho)
netlify link --id [SITE_ID]

# 3. Deploy build
netlify deploy --prod --dir=dist

# O usar script PowerShell:
.\deploy-validated.ps1 -yes
```

**Tiempo:** 3-5 minutos  
**Manual:** Minimal  
**Confirmación:** En terminal

---

### OPCIÓN C: Deploy Manual GUI

1. Abrir [https://app.netlify.com](https://app.netlify.com)
2. Seleccionar site "futpro"
3. Ir a "Deploys" tab
4. Click "Deploy site"
5. Esperar confirmación

**Tiempo:** 5-10 minutos  
**Manual:** Máximo  
**Confirmación:** Visual

---

## 🔍 VALIDAR DEPLOYMENT

### Después de deplegar, verificar:

#### 1. Health Check
```bash
# Verificar que el sitio está activo
curl https://futpro.vip/

# Debe retornar status 200 con HTML
```

#### 2. Rutas Principales
```
✓ https://futpro.vip/crear-torneo-mejorado
✓ https://futpro.vip/ranking
✓ https://futpro.vip/mi-equipo/[ID]
✓ https://futpro.vip/login
✓ https://futpro.vip/registro
```

#### 3. Funcionalidad JavaScript
Abrir DevTools (F12) y verificar:
```javascript
// En Console:
console.log('App loaded:', !!window.React)
// Debe mostrar: App loaded: true
```

#### 4. Verificar Base de Datos
```bash
# En Supabase Dashboard:
# 1. Ir a SQL Editor
# 2. Ejecutar:
SELECT COUNT(*) FROM live_streams;
SELECT COUNT(*) FROM stream_comments;
SELECT COUNT(*) FROM stream_reactions;
SELECT COUNT(*) FROM stream_events;

# Todas deben retornar 0 o el número de registros existentes
```

#### 5. Test de Componentes
1. Navegar a `/crear-torneo-mejorado`
   - ✓ ¿Se carga la UI del wizard?
   - ✓ ¿Funciona Next/Prev?
   - ✓ ¿Se validan campos?

2. Navegar a `/ranking`
   - ✓ ¿Se cargan equipos?
   - ✓ ¿Funcionan filtros?
   - ✓ ¿Se ve panel de árbitros?

3. Navegar a `/mi-equipo/[TEAM_ID]`
   - ✓ ¿Se muestra formación?
   - ✓ ¿Se carga tabla de jugadores?
   - ✓ ¿Funcionan tabs?

---

## 📊 VERIFICAR PERFORMANCE

### En Netlify Analytics:
1. Ir a "Analytics" tab
2. Verificar:
   - ✓ Page load time < 2s
   - ✓ Time to Interactive < 3s
   - ✓ Lighthouse score > 80

### En Google PageSpeed Insights:
```
https://pagespeed.web.dev/?url=https://futpro.vip
```

**Targets:**
- Performance: 80+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## 🔐 VERIFICAR SEGURIDAD

### 1. HTTPS
```bash
# Debe funcionar
curl -I https://futpro.vip/
# Status: 200 OK, con certificado válido
```

### 2. Headers de Seguridad
```bash
curl -I https://futpro.vip/ | grep -i security
```

### 3. Credenciales Supabase
- ✓ ANON_KEY está protegido
- ✓ No hay SERVICE_KEY expuesto
- ✓ RLS policies están activas

---

## 🚨 TROUBLESHOOTING

### Build falla
```bash
# Limpiar caché
rm -rf node_modules dist .next
npm install
npm run build
```

### Deploy falla
```bash
# Verificar logs en Netlify
netlify logs --tail

# O en dashboard: Deploys → Failed → View log
```

### Componentes no aparecen
```bash
# Verificar imports en App.jsx
grep -n "CrearTorneoMejorado\|RankingMejorado\|MiEquipoMejorado" src/App.jsx

# Deben estar líneas 66, 67, 68 (aproximadamente)
```

### Streaming service no funciona
```bash
# Verificar tabla en Supabase
SELECT * FROM live_streams LIMIT 1;

# Verificar RLS policies
SELECT * FROM pg_policies WHERE tablename = 'live_streams';
```

---

## 📝 ROLLBACK EN CASO DE ERROR

### Si algo sale mal:

#### Opción 1: Revert automático
```bash
# Volver a commit anterior
git revert HEAD
git push origin main
# Netlify redeploya automáticamente
```

#### Opción 2: Rollback en Netlify UI
1. Ir a https://app.netlify.com
2. Deploys → Click deploy anterior
3. "Publish deploy"

#### Opción 3: Rollback manual
```bash
# Hacer deploy de dist anterior
netlify deploy --prod --dir=dist-backup
```

---

## 📞 CHECKLIST FINAL PRE-DEPLOY

Marcar todos como completado antes de deploy:

- [ ] `npm run build` ejecutó sin errores
- [ ] `node pre-deploy-validation.js` pasó todas las validaciones
- [ ] Variables de entorno están en Netlify
- [ ] Todos los tests locales pasaron
- [ ] URLs `/crear-torneo-mejorado`, `/ranking` funcionan localmente
- [ ] Base de datos tiene 4 tablas de streaming creadas
- [ ] Git está limpio (sin cambios sin commitear)
- [ ] `git log` muestra commit más reciente
- [ ] Documentación actualizada

---

## 🎯 COMANDOS RÁPIDOS

```bash
# Validar
node pre-deploy-validation.js

# Build
npm run build

# Deploy (opción A)
git add . && git commit -m "deploy" && git push

# Deploy (opción B)
netlify deploy --prod --dir=dist

# Verificar
curl https://futpro.vip/
```

---

## 📊 EXPECTED RESULTS AFTER DEPLOY

✅ **Sitio Activo**
- URL: https://futpro.vip
- Status: 200 OK
- HTTPS: Activo

✅ **Componentes Funcionales**
- CrearTorneoMejorado: 4-step wizard
- RankingMejorado: Tabla + filtros + árbitros
- MiEquipoMejorado: Formación + Plantilla + Estadísticas

✅ **Base de Datos**
- 4 tablas streaming creadas
- 3 triggers activos
- 11 índices creados
- RLS policies habilitadas

✅ **Documentación**
- 8+ archivos de referencia
- Guías de uso incluidas
- Schema SQL documentado

---

## 🎉 CONCLUSIÓN

Si todos los checks pasaron:

```
🚀 DEPLOYMENT EXITOSO
📱 FutPro 2.0 v5.3.0 en PRODUCCIÓN
✅ 6/6 Requerimientos Completados
```

**Next:** Monitor en Netlify Analytics y Supabase para asegurar estabilidad.

---

**Última actualización:** 14 de enero 2026  
**Responsable:** GitHub Copilot  
**Status:** 🟢 LISTO PARA DEPLOY
