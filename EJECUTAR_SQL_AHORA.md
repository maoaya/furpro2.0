## 🚨 SOLUCIÓN INMEDIATA: Error 406 - Tabla carfutpro

### ❌ Error Actual
```
The schema must be one of the following: api, graphql_public, storage, graphql, realtime, vault
Failed to load resource: status 406
```

### ✅ Causa
La tabla `carfutpro` no existe en el schema `public` de Supabase o las RLS policies no están configuradas.

### 🔧 EJECUTAR AHORA EN SUPABASE

1. **Abre Supabase Dashboard**: https://supabase.com/dashboard
2. **Ve a**: Tu proyecto → SQL Editor
3. **Copia y pega el SQL completo** que compartiste (el archivo cards_system.sql actualizado)
4. **Presiona "Run"** (ejecutar)

### ⚠️ IMPORTANTE: Verificar después de ejecutar

Ejecuta esta consulta para confirmar que la tabla existe:

```sql
-- Verificar que tabla existe
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name = 'carfutpro';

-- Debe retornar: public | carfutpro
```

### Verificar RLS Policies:

```sql
-- Ver políticas RLS activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'carfutpro';

-- Debe mostrar 3 políticas:
-- 1. usuarios_pueden_ver_su_propia_card (SELECT)
-- 2. usuarios_pueden_actualizar_su_propia_card (UPDATE)
-- 3. usuarios_pueden_insertar_su_propia_card (INSERT)
```

### Verificar RLS está habilitado:

```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'carfutpro';

-- rowsecurity debe ser: true
```

### 🧪 Test de INSERT Manual

Después de ejecutar el SQL, prueba insertar un registro manualmente:

```sql
-- Reemplaza 'TU_USER_ID_AQUI' con tu user_id real de auth.users
INSERT INTO public.carfutpro (
  user_id, 
  nombre, 
  email,
  avatar_url,
  card_tier, 
  puntos_totales,
  partidos_ganados,
  entrenamientos,
  amistosos,
  puntos_comportamiento
) VALUES (
  'TU_USER_ID_AQUI'::uuid,
  'Test User',
  'test@example.com',
  '',
  'bronce',
  0,
  0,
  0,
  0,
  0
);
```

Si este INSERT funciona → problema era que tabla no existía ✅  
Si falla con error 406 → problema es con RLS policies ❌

### 🔍 Obtener tu user_id

```sql
-- Ver usuarios autenticados
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
```

### ✅ Una vez confirmado que la tabla existe

1. Vuelve a https://futpro.vip
2. Haz logout (si estás logueado)
3. Vuelve a autenticarte con Google
4. Abre F12 (Consola)
5. Deberías ver los logs: `📍 Step 1`, `📍 Step 2`, etc.
6. Si todo ok: Card se crea automáticamente ✅

---

**Status actual**: ⏸️ Esperando que ejecutes el SQL en Supabase
