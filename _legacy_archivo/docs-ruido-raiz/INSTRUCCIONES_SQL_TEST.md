# 🔵 SQL + TEST - PESO Y CATEGORÍA

## PASO 1️⃣: EJECUTAR SQL EN SUPABASE

### En Supabase Dashboard:
1. Ve a: **SQL Editor**
2. Nuevo query
3. **Copia TODO el contenido de `SQL_PARA_EJECUTAR.sql`**
4. **Ejecuta** (Ctrl+Enter)

✅ Debe decir "Query executed successfully"

---

## PASO 2️⃣: EJECUTAR TESTS SQL

Después de que SQL se ejecute, en el mismo editor, copia y ejecuta:

```sql
-- Test 1: Ver última card
SELECT 
  nombre, apellido, categoria, peso, puntos_totales, card_tier
FROM api.carfutpro
ORDER BY created_at DESC
LIMIT 1;

-- Test 2: Cards por categoría
SELECT categoria, COUNT(*) as cantidad
FROM api.carfutpro
WHERE categoria IS NOT NULL
GROUP BY categoria;

-- Test 3: Columnas existen
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'api' AND table_name = 'carfutpro'
AND column_name IN ('peso', 'categoria')
ORDER BY ordinal_position;
```

✅ **Resultado esperado:**
- Test 1: `categoria` y `peso` con valores (o NULL si aún no hay registros)
- Test 2: Múltiples categorías contadas
- Test 3: 2 filas (peso | numeric, categoria | character varying)

---

## PASO 3️⃣: TEST DE CÓDIGO (DevTools)

### En el navegador:
1. Abre DevTools (**F12**)
2. Ve a **Console**
3. **Copia TODO el contenido de `TEST_PESO_CATEGORIA.js`**
4. Pega en console y presiona Enter

✅ **Resultado esperado:**
```
✅ PESO Y CATEGORÍA ESTÁN FUNCIONANDO CORRECTAMENTE
   Peso: 75 kg
   Categoría: masculina
```

---

## PASO 4️⃣: TEST E2E (Manual en la app)

### Flujo completo:
1. Abre app en navegador
2. Ve a `/seleccionar-categoria`
3. Selecciona **"Masculina"** (o cualquier categoría)
4. Completa `/formulario-registro?categoria=masculina`
5. **Ingresa peso: 75** (ej)
6. Completa el formulario y envía

### Verificar resultado:
En `/perfil-card` debe mostrar:
- **Categoría: "Masculina"** ✅
- **Peso: "75 kg"** ✅

---

## ARCHIVOS:

| Archivo | Uso |
|---------|-----|
| `SQL_PARA_EJECUTAR.sql` | SQL completo para Supabase |
| `TEST_PESO_CATEGORIA.js` | Test de código en DevTools |
| `VERIFICAR_SQL_ACTIVO.sql` | Queries de validación |
| `CHECKLIST_SQL_PESO_CATEGORIA.md` | Guía completa |

---

## SI ALGO FALLA:

### Error: "relation 'api.carfutpro' does not exist"
→ Copia y ejecuta TODO el SQL de `SQL_PARA_EJECUTAR.sql`

### Peso muestra "—"
→ En DevTools console:
```javascript
localStorage.clear();
location.reload();
// Vuelve a registrarte
```

### Categoría muestra "—"
→ Verifica que al registrarte seleccionaste categoría en `/seleccionar-categoria`

### No aparece nada
→ Ejecuta en DevTools:
```javascript
console.log(JSON.parse(localStorage.getItem('futpro_user_card_data')))
```
Debe mostrar `peso` y `categoria` con valores

---

## RESUMEN DE CAMBIOS EN CÓDIGO:

✅ **CardManager.js** - Tiers alineados con SQL
✅ **PerfilCard.jsx** - Mapeo de categorías CORRECTO
✅ **FormularioRegistroCompleto.jsx** - Ya guardaba peso/categoría correctamente
✅ **SQL Supabase** - Tabla con campos peso y categoria
