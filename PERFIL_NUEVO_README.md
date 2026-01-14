# 🎯 PERFIL NUEVO TIPO INSTAGRAM - LISTO

## ✅ Cambios Realizados

### 1. Nueva Página de Perfil Creada
- **Archivo**: `src/pages/PerfilNuevo.jsx`
- **Diseño**: Negro y dorado como solicitaste
- **Layout**: 
  - Izquierda: Card FutPro + Stats (Fans, Siguiendo, Momentos)
  - Derecha: Feed de momentos (fotos/videos)
- **Menú superior**: Desplegable con todas las opciones

### 2. Características Implementadas
- ✅ Card FutPro con todos los datos (categoría, peso, ciudad, posición, edad, altura)
- ✅ Conteo real de FANS (seguidores de tabla `friends`)
- ✅ Conteo real de SIGUIENDO (tabla `friends`)
- ✅ Feed de MOMENTOS (Instagram style)
- ✅ Sistema de likes con ícono de balón ⚽
- ✅ Botones para comentar 💬 y guardar 🔖
- ✅ Menú superior desplegable
- ✅ Diseño negro (#000) con dorado (#FFD700)

### 3. Tablas de Base de Datos Necesarias

**IMPORTANTE**: Debes ejecutar este SQL en Supabase:

```sql
-- Ejecutar en Supabase SQL Editor
CREATE TABLE IF NOT EXISTS api.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caption TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES api.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE api.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver posts" ON api.posts FOR SELECT USING (true);
CREATE POLICY "Usuarios pueden crear posts" ON api.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden borrar sus posts" ON api.posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Todos pueden ver likes" ON api.post_likes FOR SELECT USING (true);
CREATE POLICY "Usuarios pueden dar like" ON api.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden quitar like" ON api.post_likes FOR DELETE USING (auth.uid() = user_id);
```

## 🚀 Cómo Probarlo

### Paso 1: Ejecutar SQL en Supabase
1. Ve a https://supabase.com/dashboard
2. Abre tu proyecto FutPro
3. Ve a "SQL Editor"
4. Copia y pega el SQL de arriba
5. Click en "Run"

### Paso 2: Hacer Build y Deploy
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Paso 3: Probar
Abre: https://futpro.vip/perfil

## 📸 Funcionalidades del Feed

### Implementado:
- ✅ Like con balón (⚽ + contador)
- ✅ Botón comentar (💬 + contador)
- ✅ Botón guardar (🔖)
- ✅ Menú de opciones (⋯) en cada post

### Por Implementar (siguiente fase):
- Subir nuevos momentos (foto/video)
- Sistema de comentarios completo
- Editar posts
- Eliminar posts
- Fijar posts al inicio

## 🎨 Diseño

### Colores
- Fondo principal: `#000` (negro puro)
- Cards y contenedores: `#1a1a1a` (negro suave)
- Acentos: `#FFD700` (dorado)
- Textos secundarios: `#ccc`, `#999`
- Bordes: `#333`, `#FFD700`

### Layout Responsivo
- Escritorio: 2 columnas (380px sidebar + resto feed)
- Mobile: 1 columna (próxima fase)

## 📁 Archivos Creados/Modificados

1. `src/pages/PerfilNuevo.jsx` - Nueva página de perfil ✅
2. `src/App.jsx` - Rutas actualizadas ✅
3. `CREAR_POSTS_SIMPLE.sql` - SQL para tablas ✅
4. Este archivo de documentación ✅

## ⚠️ Notas Importantes

1. **Tabla `friends`**: Ya existe en tu base de datos, se usa para conteo de seguidores
2. **Tabla `api.carfutpro`**: Ya existe, se usa para mostrar el card
3. **Nuevas tablas**: `api.posts` y `api.post_likes` deben ser creadas con el SQL

## 🔄 Próximos Pasos Sugeridos

1. Sistema de upload de fotos/videos para momentos
2. Sistema completo de comentarios
3. Botón "Editar" y "Eliminar" funcionales
4. Sistema de "Fijar" posts
5. Ver lista de "Siguiendo" en modal
6. Ver lista de "Fans" en modal
7. Versión mobile responsive

## 🐛 Troubleshooting

### Error: "relation api.posts does not exist"
- **Solución**: Ejecuta el SQL en Supabase primero

### Error: No aparecen seguidores
- **Solución**: Verifica que la tabla `friends` tenga datos

### Error: Card no aparece
- **Solución**: Verifica que el usuario tenga registro en `api.carfutpro`

## 📞 Testing Rápido

Para insertar un post de prueba (después de crear las tablas):

```sql
-- Reemplaza 'TU_USER_ID' con tu user ID real
INSERT INTO api.posts (user_id, caption, media_url) VALUES 
('TU_USER_ID', '¡Mi primer gol! ⚽🔥', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800');
```

Para obtener tu user ID:
```sql
SELECT id, email FROM auth.users;
```
