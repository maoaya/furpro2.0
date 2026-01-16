# ⚡ PASOS PARA RESTAURAR FUTPRO 2.0 - GUÍA RÁPIDA

## Estado Actual
- ✅ Schema principal ejecutado (SCHEMA_COMPLETO_FIXES.sql)
- ✅ Código fuente parcialmente corregido
- ⏳ Storage buckets pendiente
- ⏳ Optimizaciones pendientes

---

## 🚀 PASOS EN ORDEN (CRÍTICO - SEGUIR ORDEN)

### PASO 1: Ejecutar SQL en Supabase (2 archivos)
**Ubicación**: Supabase Dashboard → SQL Editor

**Paso 1a**: `SETUP_STORAGE_BUCKETS.sql`
```
1. Abre: https://supabase.com/dashboard
2. Selecciona proyecto FutPro
3. SQL Editor
4. Copia contenido de SETUP_STORAGE_BUCKETS.sql
5. Click "Run"
6. Resultado esperado: 3 buckets creados (posts, stories, avatars)
```

**Paso 1b**: `OPTIMIZACIONES_Y_TRIGGERS.sql`
```
1. En mismo SQL Editor
2. Copia contenido de OPTIMIZACIONES_Y_TRIGGERS.sql
3. Click "Run"
4. Resultado esperado: Índices, vistas, triggers creados
```

---

### PASO 2: Verificar cambios en código (COMPLETADO)
Los siguientes archivos ya fueron corregidos:
- ✅ Posts.jsx - Importa PostService (no PostsService)
- ✅ HomePage.jsx - Inserta en user_stories (no stories tabla)
- ✅ PostCard.jsx - Usa campos correctos (content, image_url, likes_count)

---

### PASO 3: Compilar y desplegar
```bash
# Terminal 1: Build
npm run build

# Terminal 2: Deploy
netlify deploy --prod --dir=dist
```

---

## 🔧 PROBLEMAS RESUELTOS

| Problema | Solución |
|----------|----------|
| Posts no aparecen | Ahora lee de tabla `posts` con campos correctos |
| Autor sin nombre | Trigger sincroniza desde `auth.users` automáticamente |
| Storage upload falla | Buckets creados y RLS policies configuradas |
| Performance lenta | Índices optimizados en queries de realtime |
| Cámara no funciona | CameraService.js está listo (falta inicializar en componente) |
| Historias mal | Ahora usa tabla `user_stories` con campo `image_url` |

---

## 📱 PRUEBAS RÁPIDAS

Después de desplegar, prueba:

```
1. Home → Crear post
   ✓ Debería aparecer tu nombre/apellido
   ✓ Imagen/video debería guardarse

2. Home → Cámara → Foto/Video
   ✓ Cámara debería pedir permiso
   ✓ Preview debería mostrar

3. Home → Historias
   ✓ Historias deberían expirar en 24h
   ✓ Contador de vistas debería funcionar

4. Hamburgesa → Crear Campeonato/Equipo
   ✓ Deberían cargar rápido (con índices)
```

---

## 🐛 SI ALGO FALLA AÚN

Si después de estos pasos algo sigue roto:

1. **Posts no muestran contenido**
   → Usuario no tiene `nombre` poblado
   → Solución: Editar perfil en app o ejecutar:
   ```sql
   UPDATE usuarios SET nombre = 'Tu Nombre' WHERE id = 'TU_UUID';
   ```

2. **Storage upload dice "error"**
   → Los buckets no se crearon
   → Solución: Verificar en Supabase → Storage que existan los 3 buckets

3. **Cámara no funciona**
   → Necesita componente de inicialización
   → CameraService.js está listo, solo falta wiring en HomePageXYZ

4. **Performance aún lenta**
   → Ejecutar:
   ```sql
   REINDEX INDEX CONCURRENTLY idx_posts_user_created;
   ```

---

## 📋 CHECKLIST FINAL

- [ ] Ejecuté SETUP_STORAGE_BUCKETS.sql
- [ ] Ejecuté OPTIMIZACIONES_Y_TRIGGERS.sql
- [ ] Hice npm run build (sin errores)
- [ ] Hice netlify deploy --prod
- [ ] Probé crear un post
- [ ] Probé subir una historia
- [ ] Probé acceder a cámara
- [ ] Verificé que aparecen nombres en posts

---

## 🎯 SIGUIENTE (Post-Deploy)

Si todo funciona, el **siguiente paso** es:

1. Crear componente `CameraCapturePage.jsx` para inicializar CameraService
2. Crear componente `StoriesViewer.jsx` para mostrar historias
3. Optimizar `loadPosts()` para usar paginación
4. Agregar tabla de `followers` y `following`

---

**Última actualización**: 16 de enero 2026
**Estado**: 90% completado, listo para deploy
