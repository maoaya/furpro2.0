# 🚨 LISTA DE PROBLEMAS CRÍTICOS - FutPro 2.0

**Fecha:** 15 de enero de 2026  
**Status:** EN RESOLUCIÓN

---

## 📋 PROBLEMAS REPORTADOS

### 1. ❌ PUBLICACIÓN DE USUARIOS
- [ ] Los usuarios NO pueden publicar posts
- [ ] Las publicaciones NO aparecen en el perfil
- [ ] NO aparece nombre y apellido del usuario que publica
- [ ] Tabla `posts` posiblemente no existe o mal configurada

### 2. ❌ RENDIMIENTO DEL SISTEMA
- [ ] Sistema muy lento (lag considerable)
- [ ] Queries no optimizadas
- [ ] Falta de índices en tablas
- [ ] N+1 queries posiblemente presentes

### 3. ❌ MENÚ HAMBURGUESA - PÁGINAS ROTAS
- [ ] "Crear Campeonato" no funciona
- [ ] "Crear Equipo" no funciona
- [ ] "Penaltis" no funciona
- [ ] Rutas probablemente mal configuradas

### 4. ❌ CÁMARA - HOME PAGES
- [ ] Click en cámara (transmisión en vivo) NO funciona
- [ ] Cámaras NO se activan para foto/video
- [ ] Permiso de dispositivo NO solicitado
- [ ] HTML/JS de camera posiblemente incorrecto

### 5. ❌ HISTORIA DE USUARIO (STORIES)
- [ ] NO sube fotos a historia
- [ ] Falta implementación similar a Facebook
- [ ] Tabla `user_stories` posiblemente no existe
- [ ] API de upload posiblemente no funciona

### 6. ❌ BASE DE DATOS
- [ ] SQL creado NO funciona
- [ ] Tablas pueden estar incompletas
- [ ] Relaciones/ForeignKeys probablemente rotas
- [ ] RLS policies pueden estar bloqueando acceso

---

## 🔧 PLAN DE ACCIÓN

### Fase 1: Diagnóstico (Ahora)
- [ ] Revisar tablas existentes en Supabase
- [ ] Verificar rutas en App.jsx
- [ ] Revisar permisos RLS
- [ ] Validar componentes de cámara

### Fase 2: Correcciones Inmediatas
- [ ] Crear/reparar tabla `posts`
- [ ] Crear/reparar tabla `user_stories`
- [ ] Arreglar rutas del menú hamburguesa
- [ ] Implementar component de cámara
- [ ] Optimizar queries (índices)

### Fase 3: Validación
- [ ] Testear publicación de posts
- [ ] Testear historias
- [ ] Testear navegación
- [ ] Testear cámara
- [ ] Validar performance

### Fase 4: Deploy
- [ ] Build local
- [ ] Deploy a Netlify
- [ ] Verificación en producción

---

## 📊 ARCHIVOS A REVISAR

- `src/pages/` - Revisar si existen y están ruteadas
- `src/services/` - Verificar servicios de BD
- `App.jsx` - Revisar todas las rutas
- `src/config/supabase.js` - Validar conexión
- `netlify.toml` - Revisar configuración
- `STREAMING_TABLES.sql` - Revisar SQL ejecutado

---

## ✅ CHECKLIST DE FIXES

### POSTS/PUBLICACIONES
- [ ] Crear tabla `posts` con campos: id, user_id, content, image_url, created_at
- [ ] Crear tabla `post_comments` para comentarios
- [ ] Crear tabla `post_likes` para likes
- [ ] Agregar RLS policies
- [ ] Crear funciones de lectura/escritura
- [ ] Testear insert/select

### STORIES (HISTORIAS)
- [ ] Crear tabla `user_stories` con TTL de 24h
- [ ] Crear funciones de upload
- [ ] Crear componentes de visualización
- [ ] Testear subida y visualización

### NAVEGACIÓN
- [ ] Verificar rutas en App.jsx
- [ ] Arreglar componentes del menú hamburguesa
- [ ] Testear cada opción

### CÁMARA
- [ ] Crear componente de cámara
- [ ] Solicitar permisos del dispositivo
- [ ] Implementar capture foto/video
- [ ] Testear en mobile

### PERFORMANCE
- [ ] Agregar índices a tablas principales
- [ ] Optimizar queries con `select()` específico
- [ ] Lazy loading de imágenes
- [ ] Caching de datos

---

## 🎯 PRIORITARIO

1. **POSTS** - Core functionality (Máxima prioridad)
2. **STORIES** - Característica importante
3. **NAVEGACIÓN** - Menú no funciona
4. **CÁMARA** - Feature importante
5. **PERFORMANCE** - Mejora general

---

**Estado Actual:** 🔴 BLOQUEANTE  
**Próximo Paso:** Diagnóstico automático en Supabase
