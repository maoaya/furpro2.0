# 🔧 PASOS PARA ARREGLAR UPLOAD DE CONTENIDO

## ⚠️ PROBLEMA ACTUAL
- Columna `ubicacion` no se reconoce en schema cache de Supabase
- Error: "Could not find the 'ubicacion' column of 'posts' in the schema cache"
- No se pueden subir fotos/videos

## ✅ SOLUCIÓN EN 3 PASOS

### PASO 1: Ejecutar SQL en Supabase (CRÍTICO)
**Archivo:** `SQL_DEFINITIVO_UBICACION.sql`

1. Abre: https://app.supabase.com/project/qqrxetxcglwrejtblwut/sql/new
2. Copia TODO el contenido de `SQL_DEFINITIVO_UBICACION.sql`
3. Pega en el editor SQL
4. Haz clic en **"Run CTRL+↵"** (botón verde)
5. **Espera 30 segundos** después de que termine
6. Verifica que aparezcan las columnas:
   - ✅ `ubicacion` (text)
   - ✅ `media_type` (text)

### PASO 2: Hacer Build
```bash
cd c:\Users\lenovo\Desktop\futpro2.0
npm run build
```
Debería terminar en ~1 minuto

### PASO 3: Deploy a Netlify
```bash
powershell -NoProfile -ExecutionPolicy Bypass -File ".\deploy-validated.ps1" -yes
```

---

## 🧪 DESPUÉS DE DEPLOY - PRUEBAS

### Test 1: Subir Foto
1. Abre https://futpro.vip
2. Clic en botón cámara 📷 (BottomNavBar)
3. Selecciona "Tomar Foto" o "Subir Foto/Video"
4. Selecciona una foto
5. Completa:
   - Descripción: "Test foto"
   - Ubicación: "Buenos Aires"
6. Clic "Publicar"
7. ✅ Debe aparecer en el feed

### Test 2: Subir Video
Igual que Test 1, pero selecciona video

### Test 3: Menu Hamburguesa
1. Clic botón ☰ (dorado, arriba derecha)
2. Debe abrir con:
   - Foto de perfil
   - Nombre del usuario
   - 26 opciones de menú

---

## 🐛 SI SIGUE FALLANDO

**Error:** "Could not find the 'ubicacion' column..."
- → Espera 5 minutos después de ejecutar SQL
- → Recarga la página (F5)
- → Intenta nuevamente

**Error:** "Failed to execute 'readAsDataURL' on 'FileReader'"
- → Problema solucionado en código
- → Necesita nuevo deploy

**Error:** "403 Forbidden" en posts
- → Problemas de RLS
- → Ejecuta: `SOLUCION_RLS_SCHEMA_CACHE.sql`

---

## 📝 ARCHIVOS IMPORTANTES

| Archivo | Descripción |
|---------|-------------|
| `SQL_DEFINITIVO_UBICACION.sql` | Script para agregar columna y refresh schema |
| `SOLUCION_RLS_SCHEMA_CACHE.sql` | Si hay errores RLS |
| `src/components/UploadContenidoComponent.jsx` | Componente de upload (corregido) |
| `src/pages/HomePage.jsx` | HomePage con MenuHamburguesa (corregido) |

---

## ⏱️ TIEMPO ESTIMADO
- Ejecutar SQL: 2 minutos
- Build: 1 minuto
- Deploy: 3-5 minutos
- **Total: ~10 minutos**

**¿Estás listo para empezar? 🚀**
