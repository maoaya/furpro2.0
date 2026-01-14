# 🚀 PLAN DE ACCIÓN: CORREGIR CARD CREATION

## PASO 1: Ejecutar Diagnóstico en Supabase
1. Ve a: https://app.supabase.com → Tu proyecto → SQL Editor
2. Copia y pega todo el contenido de: `supabase/CARD_SETUP_DIAGNOSTICO_Y_CORRECCION.sql`
3. Haz click en "Run"
4. Revisa la salida en la consola (columna derecha)

**Espera:** Esto va a:
- ✅ Verificar que `public.carfutpro` existe
- ✅ Verificar que RLS está habilitado
- ✅ Verificar que hay 4 políticas
- ✅ Recrear las políticas RLS si no existen
- ✅ Mostrar el estado final

## PASO 2: Verificar AuthCallback está correcto

El archivo ya fue actualizado: `src/pages/auth/AuthCallback.jsx`

**Lo que hace ahora:**
- Espera a Supabase procese el callback
- Llama a `getSession()` para obtener la sesión
- Lee los datos del localStorage (draft_carfutpro)
- Crea la card con `CardManager.getOrCreateCard()`
- Redirige a `/perfil-card`

**Si sigue fallando:**
Abre DevTools (F12) → Console → Busca estos mensajes:
- `=== AuthCallback START ===` ✅
- `📍 Step 1: Esperando a que Supabase procese sesión...` ✅
- `✅ Sesión obtenida:` ✅ (si ves esto, la sesión existe)
- `❌ No session found` ❌ (si ves esto, OAuth falló)

## PASO 3: Limpiar y Probar

1. Abre https://futpro.vip/registro-nuevo
2. Abre DevTools: F12 → Console
3. Ejecuta: `localStorage.clear()` y luego `location.reload()`
4. Completa el formulario:
   - Categoría: "femenina", "masculina", "infantil femenina" o "infantil masculina"
   - Edad: Mínimo 8 años
   - Todos los campos requeridos
5. Haz click en "Continuar con Google"
6. Autoriza en Google
7. Monitorea la consola para ver los logs

## PASO 4: Posibles Errores y Soluciones

### Error: "No se encontró sesión"
**Causa:** `auth.uid()` es NULL en el contexto RLS
**Solución:** 
- Verificar que Supabase Auth está habilitado
- Verificar que detectSessionInUrl: true en supabaseClient.js
- Verificar que la URL callback está en Supabase dashboard

### Error: 400 Bad Request
**Causa:** SELECT sin columnas especificadas
**Solución:** 
- CardManager.js está bien configurado
- Esto debería funcionar si RLS funciona

### Error: 401 Unauthorized
**Causa:** Credenciales inválidas
**Solución:**
- Verificar VITE_SUPABASE_URL correcto
- Verificar VITE_SUPABASE_ANON_KEY correcto

## Información de Depuración

**Tabla:** `public.carfutpro`
**Columnas principales:**
- `user_id` (UUID, unique, NOT NULL) - debe coincidir con auth.users.id
- `nombre` (VARCHAR)
- `apellido` (VARCHAR)
- `categoria` (VARCHAR) - valores: 'masculina', 'femenina', 'infantil masculina', 'infantil femenina'
- `posicion_favorita` (VARCHAR)
- `edad` (INTEGER)
- `altura` (VARCHAR)
- `peso` (VARCHAR)
- Y más...

**RLS Policies:**
- SELECT: `user_id = auth.uid()`
- INSERT: `user_id = auth.uid()`
- UPDATE: `user_id = auth.uid()`
- DELETE: `user_id = auth.uid()`

## Check Final

Después de ejecutar el SQL de diagnóstico, deberías ver:
```
✅ SISTEMA DE CARDS CONFIGURADO CORRECTAMENTE
   • RLS habilitado: SÍ
   • Políticas: 4/4
   • Listo para usar
```

Si ves esto, el sistema está listo. Si no, revisa los errores específicos en la salida.
