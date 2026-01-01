# 🚨 SOLUCIÓN ERRORES 404 EN API

## ❌ Errores Actuales

Tu app está fallando con:
- **404** en `/rest/v1/api.usuarios` 
- **404** en `/rest/v1/api.carfutpro`
- **400** "Bucket not found" en Storage

**CAUSA**: El esquema `api` NO está expuesto en PostgREST.

---

## ✅ SOLUCIÓN (3 pasos - 5 minutos)

### **1️⃣ Ejecutar SQL de corrección**

1. Abre: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/sql/new
2. Copia TODO el contenido de: `supabase/FIX_SCHEMA_API.sql`
3. Pégalo en SQL Editor
4. Click **RUN**
5. Deberías ver mensajes como:
   ```
   ✅ Esquema API creado (o ya existe)
   ✅ Tabla api.carfutpro creada
   ✅ Bucket avatars creado
   ```

### **2️⃣ Exponer esquema API en PostgREST**

1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/settings/api
2. Busca la sección **"Exposed schemas"**
3. Verifica que aparece: `public, api`
4. **SI NO APARECE `api`**:
   - En esa misma página, busca **"Extra search path"** o **"Schema cache"**
   - Puede que necesites añadir `api` manualmente
   - Alternativamente, ejecuta este SQL adicional:
     ```sql
     ALTER DATABASE postgres SET "app.settings.extra_search_path" TO 'public, api';
     NOTIFY pgrst, 'reload schema cache';
     ```

### **3️⃣ Reiniciar PostgREST**

1. En la misma página de Settings → API
2. Busca el botón **"Restart"** o **"Reload schema cache"**
3. Click para reiniciar PostgREST
4. Espera 30 segundos

---

## 🧪 VERIFICAR QUE FUNCIONA

### **Test 1: API REST**

Abre en tu navegador (o Postman):

```
https://qqrxetxcglwrejtblwut.supabase.co/rest/v1/api.carfutpro?select=*
```

**Resultado esperado:**
- ✅ Status 200 (aunque sea array vacío `[]`)
- ❌ Si sigue 404 → El esquema `api` NO está expuesto

### **Test 2: Storage**

En consola del navegador (F12):

```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .list()

console.log('Bucket test:', { data, error })
```

**Resultado esperado:**
- ✅ `data: []` o lista de archivos
- ❌ Si error "Bucket not found" → Ejecutar SQL de nuevo

### **Test 3: Flujo completo**

1. Limpia localStorage: `localStorage.clear()`
2. Ir a: `https://futpro.vip/registro-perfil`
3. Llenar + subir foto
4. OAuth con Google
5. Verificar `/perfil-card` muestra la card

---

## 🔍 DIAGNÓSTICO DETALLADO

Si aún falla después de los 3 pasos:

### **A. Verificar en Supabase Dashboard**

#### **Table Editor**
Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/editor

- ¿Aparece carpeta `api` en el árbol de esquemas?
- ¿Dentro de `api` está `carfutpro`?
- ¿Hay registros en `api.carfutpro`?

#### **Storage**
Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/storage/buckets

- ¿Aparece bucket `avatars`?
- ¿Está configurado como público?

#### **API Settings**
Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/settings/api

- En **Exposed schemas**: debe listar `public, api`
- En **Extra search path**: debe tener `public, api`

### **B. Test directo en SQL Editor**

```sql
-- Test 1: Verificar esquema
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'api';
-- Debe retornar 1 fila con 'api'

-- Test 2: Verificar tabla
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema = 'api' AND table_name = 'carfutpro';
-- Debe retornar 1 fila

-- Test 3: Verificar grants
SELECT grantee, privilege_type 
FROM information_schema.schema_privileges 
WHERE schema_name = 'api';
-- Debe mostrar grants para anon, authenticated

-- Test 4: Verificar bucket
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'avatars';
-- Debe retornar 1 fila con public=true
```

### **C. Si API sigue 404**

El problema es que PostgREST no reconoce el esquema `api`. Solución manual:

1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/settings/database
2. Busca **"Connection string"** o **"Database settings"**
3. Puede que necesites actualizar variable de entorno:
   ```
   PGRST_DB_SCHEMAS=public,api
   ```
4. **Última opción**: Contacta Supabase Support y pide que expongan el esquema `api`

---

## 📝 RESUMEN DE CAMBIOS

El SQL `FIX_SCHEMA_API.sql` hace:

1. ✅ Crea esquema `api` si no existe
2. ✅ Crea tabla `api.carfutpro` con todas las columnas
3. ✅ Crea vista `api.usuarios` sobre `public.usuarios`
4. ✅ Configura RLS policies en ambos
5. ✅ Crea bucket `avatars` en Storage
6. ✅ Configura políticas de Storage públicas
7. ✅ Otorga grants a `anon` y `authenticated`
8. ✅ Notifica a PostgREST para recargar cache

---

## 🎯 CHECKLIST FINAL

Antes de probar la app:

- [ ] SQL ejecutado sin errores
- [ ] Esquema `api` visible en Table Editor
- [ ] Tabla `api.carfutpro` existe
- [ ] Vista `api.usuarios` existe
- [ ] Bucket `avatars` existe en Storage (público)
- [ ] Settings → API muestra `api` en Exposed schemas
- [ ] PostgREST reiniciado
- [ ] Test curl/Postman retorna 200 (no 404)
- [ ] localStorage limpiado en navegador
- [ ] Build y deploy actualizados

---

## 🆘 SI TODO FALLA

Copia y pega este comando en SQL Editor como última opción:

```sql
-- Forzar exposición de esquema API
ALTER ROLE authenticator SET search_path TO api, public;
ALTER ROLE postgres SET search_path TO api, public;
ALTER ROLE anon SET search_path TO api, public;
ALTER ROLE authenticated SET search_path TO api, public;

-- Recargar PostgREST
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema cache';

SELECT 'Configuración forzada aplicada. Reinicia PostgREST manualmente desde Dashboard.' AS resultado;
```

Luego reinicia PostgREST desde Dashboard.

---

**¿Funcionó?** Avísame qué mensaje ves después de ejecutar el SQL.
