# ✅ CHECKLIST - SQL ACTIVO Y PESO/CATEGORÍA FUNCIONANDO

## 1. SQL DEBE ESTAR EJECUTADO EN SUPABASE

### Paso 1: Verificar tabla api.carfutpro existe con campos
En Supabase SQL Editor, copia y ejecuta:

```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'api' AND table_name = 'carfutpro'
AND column_name IN ('peso', 'categoria', 'puntos_totales', 'card_tier')
ORDER BY ordinal_position;
```

**Resultado esperado**: 4 filas
- peso | numeric
- categoria | character varying
- puntos_totales | integer
- card_tier | character varying

---

### Paso 2: Verificar datos en carfutpro
```sql
SELECT user_id, nombre, categoria, peso, puntos_totales, card_tier
FROM api.carfutpro
ORDER BY created_at DESC
LIMIT 5;
```

**Resultado esperado**: Ver registros con categoría (ej: "masculina", "femenina") y peso (o NULL si no ingresado)

---

## 2. FLUJO DE CÓDIGO

### Registro Completo (FormularioRegistroCompleto.jsx)
- ✅ Lee `categoria` del URL (`/formulario-registro?categoria=masculina`)
- ✅ Lee `peso` del formulario
- ✅ Pasa ambos a `profileData` (líneas 304, 339-342)
- ✅ Guarda en localStorage con `cardData`
- ✅ Navega a `/perfil-card` con `cardData`

### Card Manager (CardManager.js)
- ✅ Crea card con `categoria: profileData.categoria || 'masculina'` (línea 115)
- ✅ Crea card con `peso: profileData.peso?.toString() || ''` (línea 114)
- ✅ Inserta en tabla `api.carfutpro`

### Perfil Card (PerfilCard.jsx)
- ✅ Lee `cardData.categoria` (corrección: mapea a labels correctos)
- ✅ Lee `cardData.peso` (muestra "peso kg" si existe, sino "—")
- ✅ Mapeo de categorías CORRECTO:
  - masculina → Masculina
  - femenina → Femenina
  - infantil_masculina → Infantil Masculina
  - infantil_femenina → Infantil Femenina

---

## 3. CAMBIOS REALIZADOS

✅ **CardManager.js**
- Tiers alineados con SQL (Bronce 0-99, Plata 100-199, etc.)
- Puntos iniciales: 0 (no 15)
- Categoría comentada para claridad

✅ **PerfilCard.jsx**
- Mapeo de categorías CORREGIDO (línea 207-217)
- Puntos iniciales: 0 (no 15)
- Peso se muestra si existe

---

## 4. COMO VERIFICAR QUE FUNCIONA

### Test 1: Crear nuevo usuario
1. Ve a `/seleccionar-categoria`
2. Selecciona "Masculina"
3. Completa formulario con peso (ej: 75)
4. Termina registro
5. En `/perfil-card` debe ver:
   - ✅ Categoría: "Masculina"
   - ✅ Peso: "75 kg"

### Test 2: Verificar en BD
En Supabase:
```sql
SELECT nombre, categoria, peso FROM api.carfutpro 
WHERE nombre = '[Tu nombre]';
```
Debe mostrar: categoria='masculina', peso=75

---

## 5. SI NO FUNCIONA

Si peso o categoría salen como "—":

### Opción A: Re-ejecutar SQL
Copia TODO de `FIX_PRODUCCION_AHORA.sql` en Supabase SQL Editor

### Opción B: Limpiar y reintentar
1. Borra localStorage en DevTools
2. Borra cookies
3. Vuelve a registrarte

### Opción C: Debug
En DevTools Console:
```javascript
console.log(JSON.parse(localStorage.getItem('futpro_user_card_data')))
```
Debe mostrar `peso: 75` y `categoria: "masculina"`
