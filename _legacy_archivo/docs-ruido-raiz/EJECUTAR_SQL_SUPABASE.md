# 🚀 EJECUTAR SQL PARA API Y STORAGE

## ✅ Correcciones Aplicadas al Frontend

Se han corregido **todos** los duplicados `.from().from` y migrado las consultas al esquema `api`:

### Archivos Actualizados
- ✅ `src/context/AuthContext.jsx` → todas las consultas ahora usan `.from('api.usuarios')` sin duplicados
- ✅ `src/pages/auth/AuthCallback.jsx` → `.from('api.carfutpro')` único
- ✅ `src/pages/PerfilCard.jsx` → `.from('api.carfutpro')` 
- ✅ `src/pages/RegistroPerfil.jsx` → `.from('api.carfutpro')`
- ✅ `src/pages/ConfiguracionCuenta.jsx` → `.from('api.usuarios')`
- ✅ `src/hooks/useCardPoints.js` → `.from('api.carfutpro')`
- ✅ `src/services/UserService.js` → `.from('api.usuarios')`

### Errores Resueltos
❌ **ANTES**: `TypeError: M.from(...).from is not a function`  
✅ **DESPUÉS**: Todas las consultas usan un único `.from()` apuntando a `api.*`

---

## 📋 PASO 1: Ejecutar SQL en Supabase

### 1.1 Abrir SQL Editor
1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/sql/new
2. **Asegúrate de estar conectado al proyecto correcto** (URL en `.env`: `qqrxetxcglwrejtblwut.supabase.co`)

### 1.2 Ejecutar `cards_system.sql`
```sql
-- Copiar y pegar TODO el contenido de: supabase/cards_system.sql
-- Este archivo crea:
--   - public.usuarios con RLS
--   - public.carfutpro con RLS
--   - Trigger set_updated_at
--   - Políticas de Storage para storage.objects
```

**✅ Resultado esperado:**
```
Query executed successfully in XXXms
```

### 1.3 Ejecutar `setup_api_schema.sql`
```sql
-- Copiar y pegar TODO el contenido de: supabase/setup_api_schema.sql
-- Este archivo crea:
--   - Bucket 'avatars' en storage.buckets
--   - Esquema api
--   - Vista api.usuarios (con reglas INSERT/UPDATE/DELETE)
--   - Tabla api.carfutpro con RLS
--   - Migración de datos de public.carfutpro a api.carfutpro
```

**✅ Resultado esperado:**
```
Query executed successfully
NOTICE: ✅ Configuración completada
NOTICE:    - Bucket "avatars" en storage.buckets
NOTICE:    - Esquema "api" creado
NOTICE:    - Vista "api.usuarios" configurada
...
```

---

## 🔍 PASO 2: Verificar Bucket de Storage

### 2.1 Comprobar Bucket
1. Ve a: **Storage → Buckets** en dashboard de Supabase
2. Verifica que existe `avatars` con:
   - **Public**: ✅ (ON)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/jpg, image/webp`

### 2.2 Si el Bucket NO existe
Ejecuta manualmente en SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
);
```

---

## 📡 PASO 3: Verificar Exposición del Esquema API

### 3.1 Settings → API
1. Ve a: **Settings → API** en Supabase dashboard
2. Busca la sección **"Exposed schemas"**
3. **Verifica que incluye**: `public, api`

### 3.2 Si `api` NO está expuesto
Ejecuta en SQL Editor:
```sql
-- Exponer esquema api para PostgREST
ALTER ROLE anon SET search_path TO api, public;
ALTER ROLE authenticated SET search_path TO api, public;

-- Recargar configuración de PostgREST
NOTIFY pgrst, 'reload config';
```

---

## 🧪 PASO 4: Probar Flujo Completo

### 4.1 Limpiar Estado Local
Abrir DevTools (F12) y ejecutar en consola:
```javascript
localStorage.clear()
sessionStorage.clear()
console.log('✅ Storage limpiado, recarga la página')
```

### 4.2 Flujo de Prueba
1. **Registro con foto**:
   - Llenar formulario en `/registro-perfil`
   - Subir foto (debe guardarse data URL en `localStorage.draft_carfutpro`)
   - Hacer clic en "Continuar con Google"

2. **OAuth Callback**:
   - Redirige a `/auth/callback`
   - Buscar en consola:
     ```
     ✅ Session obtained
     📤 Subiendo blob a Storage
     ✅ Foto subida exitosamente
     ✅ Card created successfully
     ```

3. **PerfilCard**:
   - Debe mostrar la card con:
     - ✅ Foto subida (no foto de Google)
     - ✅ Datos del formulario (nombre, edad, posición, pie, estatura, ciudad)
     - ✅ Puntos iniciales: 35
     - ✅ Tier: Bronce

---

## ❌ DIAGNÓSTICO DE ERRORES

### Error: "Bucket not found" (400)
**Causa**: Bucket `avatars` no existe en `storage.buckets`  
**Solución**: Ejecutar `setup_api_schema.sql` completo o crear bucket manualmente (ver Paso 2.2)

### Error: 406 Not Acceptable
**Causa**: Esquema `api` no expuesto en PostgREST  
**Solución**: Verificar Settings → API → Exposed schemas (Paso 3)

### Error: "relation api.carfutpro does not exist"
**Causa**: `setup_api_schema.sql` no ejecutado  
**Solución**: Ejecutar script completo (Paso 1.3)

### Error: 401 Unauthorized en `/auth/v1/health`
**Causa**: Request sin token (normal si no estás autenticado)  
**Solución**: ❌ **NO es un error**, es comportamiento esperado para rutas protegidas sin sesión

### Error: "k.from(...).from is not a function"
**Causa**: Código viejo con `.from().from` duplicado  
**Solución**: ✅ **YA CORREGIDO** en todos los archivos (ver lista arriba)

---

## 🎯 CHECKLIST FINAL

Antes de hacer deploy o probar en producción:

- [ ] `cards_system.sql` ejecutado sin errores
- [ ] `setup_api_schema.sql` ejecutado sin errores
- [ ] Bucket `avatars` visible en Storage → Buckets (público)
- [ ] Esquema `api` incluido en Settings → API → Exposed schemas
- [ ] Tablas `api.carfutpro` y vista `api.usuarios` listadas en Table Editor
- [ ] RLS policies activas en `api.carfutpro` (4 policies)
- [ ] Build local exitoso: `npm run build` sin errores
- [ ] localStorage limpiado antes de probar flujo
- [ ] Consola del navegador sin errores 406/400 "Bucket not found"
- [ ] Card muestra foto subida, no foto de Google

---

## 🔗 Enlaces Rápidos

- **SQL Editor**: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/sql/new
- **Storage Buckets**: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/storage/buckets
- **API Settings**: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/settings/api
- **Table Editor**: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/editor

---

## 📝 Notas Importantes

1. **Exposición de esquemas**: Supabase PostgREST solo expone esquemas configurados explícitamente. Si `api` no está en la lista, las consultas `.from('api.usuarios')` devolverán 406.

2. **Migración de datos**: El script `setup_api_schema.sql` copia automáticamente datos de `public.carfutpro` a `api.carfutpro` usando `ON CONFLICT DO NOTHING`, por lo que es seguro ejecutarlo múltiples veces.

3. **Bucket público**: El bucket `avatars` está configurado como público (`public: true`) para que las URLs generadas con `getPublicUrl()` funcionen sin autenticación.

4. **RLS en vistas**: La vista `api.usuarios` hereda las políticas RLS de `public.usuarios` mediante reglas que redirigen operaciones a la tabla subyacente.

5. **Grants POST-creación**: Los grants a `anon` y `authenticated` deben aplicarse **después** de crear tablas/vistas para que PostgREST las reconozca.
