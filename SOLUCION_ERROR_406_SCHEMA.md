# 🚨 SOLUCIÓN INMEDIATA: Error 406 Schema

## Error Actual
```
Error al crear card: The schema must be one of the following: 
api, graphql_public, storage, graphql, realtime, vault

Failed to load resource: status 406 (Not Acceptable)
```

## ¿Qué Significa?
La tabla `carfutpro` **NO EXISTE** en el schema `public` de Supabase, o tiene configuración incorrecta.

---

## 🔧 SOLUCIÓN (3 pasos)

### PASO 1: Abrir Supabase SQL Editor

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto **FutPro**
3. Click en **SQL Editor** (menú izquierdo)
4. Click en **New Query**

### PASO 2: Ejecutar Script FIX

Copia **TODO** el contenido del archivo: `sql/FIX_SCHEMA_406.sql`

Pega en el editor SQL y presiona **RUN**

Este script:
- ✅ Verifica si la tabla existe
- ✅ Crea la tabla `public.carfutpro` con todas las columnas
- ✅ Habilita RLS (Row Level Security)
- ✅ Crea 4 políticas: INSERT, SELECT, UPDATE, DELETE
- ✅ Crea funciones `calcular_tier_card()` y `agregar_puntos_jugador()`
- ✅ Da permisos a usuarios autenticados

### PASO 3: Verificar que Funcionó

Ejecuta esta query en Supabase SQL Editor:

```sql
-- Debe retornar: schemaname=public, tablename=carfutpro
SELECT schemaname, tablename, tableowner
FROM pg_tables 
WHERE tablename = 'carfutpro';

-- Debe retornar 4 policies
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'carfutpro';
```

**Resultado esperado:**
```
schemaname: public
tablename: carfutpro
tableowner: postgres

policies:
- users_can_insert_own_card (INSERT)
- users_can_select_own_card (SELECT)
- users_can_update_own_card (UPDATE)
- users_can_delete_own_card (DELETE)
```

---

## 🧪 Test Manual (Opcional)

Para verificar que INSERT funciona, ejecuta:

```sql
-- Reemplaza 'TU_USER_ID' con tu user_id real
INSERT INTO public.carfutpro (
  user_id, 
  nombre, 
  email, 
  card_tier, 
  puntos_totales
)
VALUES (
  'TU_USER_ID', 
  'Test User', 
  'test@example.com', 
  'bronce', 
  0
);

-- Ver resultado
SELECT * FROM public.carfutpro;
```

Si sale **error de permisos**, significa que RLS está funcionando (es normal).
Si funciona, borra el test:

```sql
DELETE FROM public.carfutpro WHERE nombre = 'Test User';
```

---

## 🔄 Después de Ejecutar el Script

1. **NO necesitas rebuild ni redeploy**
2. Simplemente recarga https://futpro.vip
3. Intenta registrarte con Google nuevamente
4. Ahora debe crear la card sin error 406

---

## 🎯 ¿Por Qué Pasó Esto?

El script `sql/cards_system.sql` que ejecutaste antes probablemente:
- Creó las columnas en una tabla existente que NO está en schema `public`
- O no creó la tabla desde cero
- O usó un schema diferente

El script `FIX_SCHEMA_406.sql` garantiza que:
- La tabla existe en `public` (schema correcto)
- Tiene TODAS las columnas necesarias
- RLS está habilitado con políticas correctas
- Las funciones están disponibles

---

## 📊 Estructura Completa de la Tabla

```sql
public.carfutpro:
├── user_id (UUID, PRIMARY KEY, FK → auth.users)
├── nombre (TEXT)
├── apellido (TEXT)
├── email (TEXT)
├── avatar_url (TEXT)
├── categoria (TEXT)
├── posicion (TEXT)
├── nivel_juego (INTEGER)
├── pais (TEXT)
├── ciudad (TEXT)
├── card_tier (TEXT) → 'bronce' | 'plata' | 'oro' | 'diamante' | 'leyenda'
├── puntos_totales (INTEGER)
├── partidos_ganados (INTEGER)
├── entrenamientos (INTEGER)
├── amistosos (INTEGER)
├── puntos_comportamiento (INTEGER)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

---

## ✅ Checklist Final

- [ ] Ejecuté `FIX_SCHEMA_406.sql` en Supabase
- [ ] Verifiqué que retorna 4 policies
- [ ] Recargar https://futpro.vip
- [ ] Probar registro con Google
- [ ] Ver logs en F12 (deben ser ✅ en vez de ❌)
- [ ] Card aparece en `/perfil-card`

---

**Después de ejecutar el script, avísame y probamos juntos** 🚀
