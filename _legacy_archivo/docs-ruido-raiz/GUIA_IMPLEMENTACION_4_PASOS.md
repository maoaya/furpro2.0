# 🚀 Guía de Implementación: 4 Pasos Críticos

## ✅ Completado

Todo el código ha sido implementado en el proyecto FutPro. A continuación, los pasos para finalizar la configuración en Supabase.

---

## 🔧 PASO 1: Crear tabla marketplace_items

**Archivo:** `SQL_MARKETPLACE_SETUP.sql`

### Instrucciones:
1. Abre [Supabase Dashboard](https://app.supabase.com)
2. Dirígete a tu proyecto FutPro
3. Abre **SQL Editor** (lado izquierdo)
4. Copia y pega el contenido de `SQL_MARKETPLACE_SETUP.sql`
5. Click en **Run** (botón azul)

### Qué hace:
✅ Crea tabla `marketplace_items` con campos:
- `id` (UUID, PK)
- `seller_id` (FK a auth.users)
- `title`, `description`, `price`
- `category`, `image_url`, `location`
- `stock`, `seller_name`, `contact_phone`
- `created_at`, `updated_at`, `status`

✅ Crea índices para optimizar queries
✅ Trigger automático para actualizar `updated_at`
✅ Habilita Realtime Replication

**Tiempo:** ~2 minutos

---

## 🔐 PASO 2: Configurar RLS Policies

**Archivo:** `SQL_RLS_POLICIES.sql`

### Instrucciones:
1. En Supabase SQL Editor, copia y pega el contenido
2. Click en **Run**

### Qué hace:
✅ **Tabla posts**:
- SELECT: Todos pueden leer
- INSERT: Solo autenticados
- UPDATE/DELETE: Solo propietario

✅ **Tabla likes**:
- SELECT: Todos pueden ver
- INSERT/DELETE: Solo el usuario autenticado

✅ **Tabla comments**:
- SELECT: Todos pueden ver
- INSERT/UPDATE/DELETE: Solo el usuario del comentario

✅ **Tabla friends**:
- SELECT: Los usuarios involucrados
- INSERT/DELETE: Los usuarios involucrados

✅ **Tabla marketplace_items**:
- SELECT: Productos activos para todos
- INSERT/UPDATE/DELETE: Solo el vendedor

✅ **Tabla users**:
- SELECT: Perfil público visible
- UPDATE: Solo el usuario

✅ **Vista `user_stats`**: Para conteos sin N+1 queries

**Tiempo:** ~2 minutos

---

## 📱 PASO 3: Filtrar HomePage por Followers

**Archivo modificado:** `src/pages/HomePage.jsx`

### Cambios:
✅ Nueva función `cargarFollowers()`:
```javascript
// Obtiene lista de usuarios que el usuario actual sigue
const followedUsers = await supabase
  .from('friends')
  .select('friend_email')
  .eq('user_email', user.email)
```

✅ Modificada función `cargarPosts()`:
```javascript
// Separa posts en:
// 1. Posts de usuarios seguidos (principal)
// 2. Sugerencias (otros usuarios con alto engagement)
const followed = formatted.filter(p => followedUsers.includes(p.user_id));
const suggested = formatted.filter(p => !followedUsers.includes(p.user_id));
```

✅ Nueva estructura del main:
- **Sección 1:** 📰 Posts de usuarios seguidos
- **Sección 2:** ✨ Descubre nuevos contenidos (sugerencias)

✅ Mejora UX:
- Posts seguidos con border gold (#FFD700)
- Sugerencias con border naranja (#FFB347) y opacidad 0.8
- Ambas secciones con contadores

**Tiempo:** Automático (ya implementado)

---

## 💬 PASO 4: Modal Completo de Comentarios

**Nuevo archivo:** `src/components/CommentsModal.jsx`

### Características:
✅ Modal popup con header, contenido, footer

✅ **Visualización de comentarios**:
- Comentarios principales con avatar
- Respuestas (replies) anidadas
- Fecha formateada

✅ **Interactividad**:
- Responder a comentarios principales
- Eliminar propio comentario/respuesta
- Input para nuevo comentario
- Inputs para respuestas
- Presionar Enter para enviar

✅ **Realtime**:
- Canal Supabase `comments:post:{postId}`
- Auto-refresh al agregar/eliminar comentarios

✅ **Diseño**:
- Tema oscuro con bordes gold
- Avatares de usuarios
- Distinción visual entre comentarios y replies
- Scroll interno para listas largas

### Uso en HomePage:
```javascript
// Button en cada post abre modal
<button onClick={() => setSelectedPostForComments(post.id)}>
  💬 {post.comments}
</button>

// Modal en bottom de HomePage
<CommentsModal 
  postId={selectedPostForComments}
  isOpen={!!selectedPostForComments}
  onClose={() => setSelectedPostForComments(null)}
/>
```

**Tiempo:** Automático (ya implementado)

---

## 📊 Resumen de Cambios

| Elemento | Estado | Archivo |
|----------|--------|---------|
| Tabla marketplace_items | 🔴 Crear en Supabase | SQL_MARKETPLACE_SETUP.sql |
| RLS Policies | 🔴 Ejecutar SQL | SQL_RLS_POLICIES.sql |
| HomePage filtrado | ✅ Implementado | src/pages/HomePage.jsx |
| CommentsModal | ✅ Implementado | src/components/CommentsModal.jsx |
| Realtime | ✅ Implementado | Todos los componentes |

---

## 🎯 Checklist de Validación

### Después de crear tabla marketplace_items:
- [ ] Tabla existe en Supabase (ver en Table Editor)
- [ ] Tiene todos los campos requeridos
- [ ] Realtime está habilitado
- [ ] Índices se crearon exitosamente

### Después de ejecutar RLS Policies:
- [ ] Políticas aparecen en Authentication > Policies
- [ ] Tabla posts tiene 4 políticas (SELECT, INSERT, UPDATE, DELETE)
- [ ] Tabla likes tiene 3 políticas (SELECT, INSERT, DELETE)
- [ ] Tabla comments tiene 4 políticas
- [ ] Vista `user_stats` se creó

### Después de recargar HomePage:
- [ ] Posts de usuarios seguidos aparecen en sección principal
- [ ] Sugerencias aparecen si no sigues a muchos usuarios
- [ ] Click en 💬 abre modal de comentarios
- [ ] Modal muestra comentarios con replies
- [ ] Puedes agregar comentarios y respuestas
- [ ] Realtime actualiza al agregar comentarios en otra pestaña

### Después de crear marketplace_items:
- [ ] Marketplace carga productos desde Supabase (no fallback)
- [ ] Realtime muestra nuevos productos al agregar

---

## ⚠️ Problemas Comunes

### "Error: posts table not found"
→ Asegúrate que ya existe la tabla posts en Supabase
→ Si no existe, ejecuta `futpro_schema_complete.sql` primero

### "RLS policy errors"
→ Las políticas pueden fallar si el usuario no tiene campo `id` en table users
→ Verifica que table users tenga: `id (UUID)`, `email`, `full_name`, `avatar_url`

### "Modal no abre"
→ Verifica que CommentsModal.jsx se importó correctamente en HomePage.jsx
→ Línea 3: `import CommentsModal from '../components/CommentsModal.jsx';`

### "Comentarios no cargan en modal"
→ Verifica que la tabla `comments` tenga columna `parent_id` (para replies)
→ Si no tiene, ejecuta:
```sql
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
```

---

## 🔍 Verificar Implementación

### Terminal - Verificar HomePage compila:
```bash
npm run dev
# Debería iniciar Vite sin errores
```

### En navegador (http://localhost:5173):
1. Inicia sesión
2. HomePage debe cargar posts divididos en 2 secciones
3. Click en 💬 abre CommentsModal
4. Modal permite escribir comentarios y respuestas
5. Presionar Enter envía

### En Supabase Dashboard:
1. Table Editor > marketplace_items (debe existir)
2. Authentication > Policies (debe haber ~20 políticas)
3. SQL Editor > Ejecutar: `SELECT * FROM user_stats LIMIT 1` (debe traer datos)

---

## 🚀 Próximos Pasos (Opcional)

Después de validar estos 4 pasos:

1. **Notificaciones**: Implementar sistema de notificaciones para likes/comentarios
2. **Upload de imágenes**: Conectar a Supabase Storage en lugar de URLs
3. **Stories**: Crear tabla temporal con 24-hour expiration
4. **Messaging**: Implementar chat directo entre usuarios
5. **Pagos**: Integrar Stripe para Marketplace

---

## 📞 Soporte

Si encuentras errores:
1. Verifica la consola del navegador (F12 > Console)
2. Verifica logs de Supabase (SQL Editor > Explain Plan)
3. Compara con archivos de referencia en el repo

**Tiempo total esperado:** 5-10 minutos (incluyendo validación)
