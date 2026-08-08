## 🎓 GUÍA VISUAL: Ejecutar SQL en Supabase

### PASO 1: Crear tabla marketplace_items

#### Paso 1.1 - Abrir Supabase Dashboard
```
1. Ve a: https://app.supabase.com
2. Inicia sesión con tu cuenta
3. Selecciona proyecto "FutPro" o tu proyecto
4. En el menú izquierdo, busca "SQL Editor"
5. Click en "SQL Editor"
```

#### Paso 1.2 - Crear nueva query
```
1. Click en botón "+ New query" (arriba)
2. O presiona: Ctrl+K
3. Se abre un editor de texto en blanco
```

#### Paso 1.3 - Copiar SQL
```
1. Abre archivo: SQL_MARKETPLACE_SETUP.sql
2. Selecciona TODO el contenido (Ctrl+A)
3. Cópialo (Ctrl+C)
4. En el editor de Supabase, pega (Ctrl+V)
```

#### Paso 1.4 - Ejecutar
```
1. Click en botón azul "Run" (abajo derecha)
2. O presiona: Ctrl+Enter
3. Espera a que termine (2-3 segundos)
4. Debe aparecer: "Query executed successfully" ✅
```

#### Paso 1.5 - Verificar
```
1. En el menú izquierdo, click en "Table Editor"
2. En la lista de tablas, busca: marketplace_items
3. Debe aparecer la tabla con todos los campos
4. ✅ COMPLETADO
```

---

### PASO 2: Configurar RLS Policies

#### Paso 2.1 - Nueva query
```
1. Vuelve a SQL Editor
2. Click "+ New query"
3. O abre una nueva pestaña
```

#### Paso 2.2 - Copiar SQL
```
1. Abre archivo: SQL_RLS_POLICIES.sql
2. Selecciona TODO (Ctrl+A)
3. Cópialo (Ctrl+C)
4. En editor de Supabase, pega (Ctrl+V)
```

#### Paso 2.3 - Ejecutar
```
1. Click botón "Run" (o Ctrl+Enter)
2. Esto tardará más (10-15 segundos)
3. Debe mostrar: "Query executed successfully" ✅
```

#### Paso 2.4 - Verificar políticas
```
1. En menú izquierdo, click en "Authentication"
2. Click en "Policies"
3. En el dropdown "Table", selecciona cada tabla:
   - posts (debe mostrar 4 políticas)
   - likes (debe mostrar 3 políticas)
   - comments (debe mostrar 4 políticas)
   - friends (debe mostrar 2 políticas)
   - users (debe mostrar 2 políticas)
   - marketplace_items (debe mostrar 4 políticas)
4. Total: 20 políticas ✅
```

---

### PASO 3: Probar HomePage con feed filtrado

#### Paso 3.1 - Compilar cambios
```bash
# En tu terminal:
npm run dev

# Debe iniciar Vite sin errores
```

#### Paso 3.2 - Abrir en navegador
```
URL: http://localhost:5173
```

#### Paso 3.3 - Inicia sesión
```
1. Login con tu usuario de prueba
2. Debe redirigir a HomePage
```

#### Paso 3.4 - Verificar structure
```
Debe ver:
┌─────────────────────────────────┐
│   🏠 Home | 🛒 Market | ...    │  ← Top nav
├─────────────────────────────────┤
│   [Search bar]   [🔔] [☰]      │
├─────────────────────────────────┤
│                                 │
│  📰 Posts de usuarios seguidos  │  ← Sección 1
│  [Post 1]                       │
│  [Post 2]                       │
│                                 │
│  ✨ Descubre nuevos contenidos  │  ← Sección 2
│  [Suggested 1]                  │
│  [Suggested 2]                  │
│                                 │
├─────────────────────────────────┤
│ 🏠 Home | 🛒 Market | ... [+]  │  ← Bottom nav + button
└─────────────────────────────────┘
```

#### Paso 3.5 - Probar comentarios
```
1. En cualquier post, click en: 💬 comentarios
2. Debe abrir modal con:
   - Header: "💬 Comentarios (X)"
   - Lista de comentarios
   - Input para nuevo comentario
   - Botón "💬 Comentar"
3. Escribe un comentario
4. Presiona Enter o click en botón
5. Comentario debe aparecer automáticamente
6. Click ✕ para cerrar modal
```

---

### VERIFICACIÓN FINAL

#### ✅ En Supabase:
```
☑ Tabla marketplace_items existe
☑ Tabla tiene 13 campos (id, seller_id, title, ...)
☑ 20 políticas RLS configuradas
☑ Índices creados correctamente
```

#### ✅ En HomePage:
```
☑ Compila sin errores
☑ Se ven 2 secciones de posts
☑ Posts seguidos en oro (gold)
☑ Sugerencias en naranja
☑ Click en ⚽ da/quita like
☑ Click en 💬 abre modal
☑ Modal permite agregar comentarios
☑ Modal muestra respuestas anidadas
```

#### ✅ En Marketplace:
```
☑ Navegación a /marketplace funciona
☑ Carga productos (Supabase o fallback mock)
☑ Click en producto muestra detalles
```

---

## 🎯 CHECKLIST FINAL

| Paso | Tarea | Estado |
|------|-------|--------|
| 1 | Crear tabla marketplace_items | ⏳ |
| 2 | Ejecutar RLS Policies | ⏳ |
| 3 | Verificar en Supabase | ⏳ |
| 4 | Compilar con npm run dev | ⏳ |
| 5 | Inicia sesión en HomePage | ⏳ |
| 6 | Verifica 2 secciones de posts | ⏳ |
| 7 | Prueba modal de comentarios | ⏳ |
| 8 | Prueba agregar comentario | ⏳ |
| 9 | Prueba responder comentario | ⏳ |
| 10 | Verifica Marketplace carga | ⏳ |

---

## 💡 TIPS Y TRUCOS

### Generar datos de prueba

Para que HomePage tenga posts para filtrar:

```sql
-- Crear post de prueba
INSERT INTO posts (user_id, content, image_url, tags, created_at)
SELECT 
  u.id,
  'Este es un post de prueba',
  'https://via.placeholder.com/400',
  ARRAY['test', 'futpro'],
  NOW()
FROM users u
WHERE u.email = 'tu-email@gmail.com'
LIMIT 1;

-- Crear like de prueba
INSERT INTO likes (post_id, user_id)
SELECT p.id, u.id
FROM posts p, users u
WHERE u.email = 'otro-usuario@gmail.com'
LIMIT 1;

-- Crear comentario de prueba
INSERT INTO comments (post_id, user_id, content)
SELECT p.id, u.id, 'Comentario de prueba'
FROM posts p, users u
WHERE u.email = 'otro-usuario@gmail.com'
LIMIT 1;
```

### Ver logs de errores

En navegador, presiona F12:
```
1. Click en pestaña "Console"
2. Busca errores rojos
3. Anota el mensaje de error
4. Compara con troubleshooting en GUIA_IMPLEMENTACION_4_PASOS.md
```

### Resetear datos (Danger!)

Si quieres empezar desde cero:

```sql
-- ⚠️ CUIDADO: Esto elimina TODOS los posts!
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM posts;

-- Para datos de prueba nuevos, usa inserts arriba
```

---

## 🆘 AYUDA RÁPIDA

### Problema: "Error en SQL"
→ Verifica que copiaste TODA la query (desde el principio)
→ Revisa si falta punto y coma (;) al final

### Problema: "Query no se ejecuta"
→ Asegúrate de estar en la pestaña correcta
→ Click en botón azul "Run" (no en otros botones)
→ Espera a que termine

### Problema: "Tabla no aparece en Table Editor"
→ Presiona F5 para refrescar
→ O click en el ícono de "Refresh" (flechita circular)

### Problema: "HomePage no compila"
→ Abre terminal y verifica si hay errores
→ Ejecuta: npm run dev
→ Lee el error en rojo
→ Compara con archivos en repo

### Problema: "CommentsModal no abre"
→ Verifica que CommentsModal.jsx exista
→ Verifica que se importe en HomePage.jsx línea 3
→ Recarga navegador (Ctrl+Shift+R)

---

## 🎓 CONCEPTOS CLAVE

### marketplace_items
Tabla que almacena productos en venta. Similar a otras redes:
- Mercado Libre: "Publicaciones"
- Amazon: "Productos en catálogo"
- Instagram Shop: "Items for sale"

### RLS (Row Level Security)
Sistema de seguridad que controla quién puede ver/editar qué:
- "Solo el propietario puede editar su post"
- "Todos pueden ver posts públicos"
- "Solo el vendedor puede ver sus órdenes"

### Realtime
Actualización en vivo sin recargar página:
- Cuando alguien da like, ves el número subir
- Cuando escriben comentario, aparece al instante
- Cuando cambian precio del producto, ves cambio

### Anidamiento (Nesting)
Respuestas dentro de comentarios:
```
Comentario 1
  └─ Respuesta 1.1
  └─ Respuesta 1.2
Comentario 2
  └─ Respuesta 2.1
```

---

## 📞 CONTACTO

Si encuentras problemas:
1. Verifica todos los pasos de esta guía
2. Revisa archivo: GUIA_IMPLEMENTACION_4_PASOS.md
3. Busca error en sección "⚠️ Problemas Comunes"
4. Revisa logs del navegador (F12)

---

**Estado:** 2/4 pasos completados | 2/4 pasos pendientes
**Tiempo restante:** 5-10 minutos
**Dificultad:** Muy Baja (copy-paste en Supabase + verificación)

✅ Listo para implementar!
