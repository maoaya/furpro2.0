# 🚨 INSTRUCCIONES PARA RESOLVER CREACIÓN DE CARDS - AHORA

## EL PROBLEMA

El error es: **"Failed to load resource: the server responded with a status of 400"**

Causa: Las RLS policies están bloqueando el INSERT porque `auth.uid()` es NULL en el contexto OAuth.

## LA SOLUCIÓN (3 PASOS)

### PASO 1: Ejecutar SQL en Supabase (2 minutos)

1. Abre: https://app.supabase.com → Tu proyecto → SQL Editor
2. **Copia TODO** el contenido de este archivo: `supabase/CARD_FIX_IMMEDIATO.sql`
3. **Pégalo** en el editor
4. Haz click en **Run**
5. Espera a ver ✅ en la salida

Esto va a:
- Deshabilitar RLS temporalmente
- Recrear políticas más permisivas
- Verificar que todo esté correcto

### PASO 2: Limpiar Navegador (1 minuto)

1. Abre: https://futpro.vip
2. Presiona **F12** (DevTools)
3. En console, ejecuta:
   ```javascript
   localStorage.clear()
   ```
4. Presiona **F5** para recargar

### PASO 3: Probar Registro (5 minutos)

1. Ve a: https://futpro.vip/registro-nuevo
2. Completa el formulario:
   - **Categoría**: femenina, masculina, infantil femenina, o infantil masculina
   - **Edad**: Mínimo 8 años
   - **Todos los campos requeridos**
3. Haz click en **"Continuar con Google"**
4. Autoriza en Google
5. Deberías ver una pantalla con tu card

---

## SI AÚN FALLA

**Abre DevTools (F12) → Console** y busca:

### ✅ Lo que deberías ver:
```
=== AuthCallback START ===
📍 Step 1: Esperando a que Supabase procese sesión...
✅ Sesión obtenida: { user_id: "...", email: "..." }
✅ Card creada exitosamente
```

### ❌ Si ves esto, el problema está en Supabase:
```
❌ No session found
```
→ Significa que OAuth no se procesó correctamente

### ❌ Si ves error 400:
```
Failed to load resource: 400
```
→ Significa que RLS policy está bloqueando (ejecuta el SQL de PASO 1)

---

## VERIFICACIÓN RÁPIDA

Después de ejecutar el SQL, verifica en Supabase:

1. Ve a: Supabase → SQL Editor
2. Ejecuta esta query:
   ```sql
   SELECT relrowsecurity 
   FROM pg_class c
   JOIN pg_namespace n ON c.relnamespace = n.oid
   WHERE n.nspname = 'public' AND c.relname = 'carfutpro';
   ```
3. Deberías ver: `true` (RLS habilitado)

---

## INFO TÉCNICA

**Tabla**: `public.carfutpro`
**Columna key**: `user_id` (debe coincidir con `auth.users.id`)

**RLS Policies creadas**:
- `card_select_authenticated` - SELECT para usuarios autenticados
- `card_insert_authenticated` - INSERT para usuarios autenticados  
- `card_update_authenticated` - UPDATE para usuarios autenticados
- `card_delete_authenticated` - DELETE para usuarios autenticados

Todas verifican: `user_id = auth.uid()`

---

## CONTACTO

Si después de TODOS estos pasos sigue fallando:
1. Toma screenshot de DevTools console (errores en rojo)
2. Copia el error exacto
3. Contacta soporte con screenshot

El error específico nos dirá exactamente qué está fallando.
