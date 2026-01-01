<!-- MARKDOWN START -->
# 📋 Guía Completa de Ejecución: Sistema de Cards FutPro

> **Versión:** 1.0  
> **Fecha:** 23 de diciembre de 2025  
> **Estado:** ✅ Completo y listo para usar

---

## 📑 Índice

1. [Requisitos previos](#requisitos-previos)
2. [Orden de ejecución](#orden-de-ejecución)
3. [Descripción de cada script](#descripción-de-cada-script)
4. [Verificaciones después de cada paso](#verificaciones-después-de-cada-paso)
5. [Guías y referencias](#guías-y-referencias-rápidas)
6. [Troubleshooting](#troubleshooting)
7. [Comandos de prueba rápidos](#comandos-de-prueba-rápidos)

---

## 🔧 Requisitos Previos

Antes de ejecutar cualquier script, asegúrate de:

- [ ] Acceso a **Supabase SQL Editor** de tu proyecto
- [ ] Permisos de `service_role` o `postgres`
- [ ] Que no existan tablas conflictivas previas (los scripts usan `IF NOT EXISTS`)
- [ ] Tener el archivo `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

---

## 🚀 Orden de Ejecución

### **PASO 0️⃣: Agregar funciones de verificación modular** ⭐ PRIMERO
📁 Archivo: `supabase/sql/00_FUNCIONES_VERIFICACION.sql`

```
Propósito: Crear funciones auxiliares para verificar estado del sistema
Tiempo: ~3 segundos
Dependencias: Ninguna (EJECUTAR PRIMERO)
```

**Pasos:**
1. Abre Supabase → SQL Editor
2. Copia contenido completo de `supabase/sql/00_FUNCIONES_VERIFICACION.sql`
3. Click "Run"
4. Verifica: ✅ "Funciones de verificación agregadas correctamente"

**Funciones agregadas:**
```sql
-- Verificar tabla
SELECT * FROM verificar_tabla_existe('public', 'card_player');

-- Verificar función
SELECT * FROM verificar_funcion_existe('public', 'agregar_puntos_jugador');

-- Verificar schema
SELECT * FROM verificar_schema_existe('api');

-- Ver estado general (RECOMENDADO)
SELECT * FROM obtener_estado_sistema();

-- Generar reporte completo
SELECT * FROM generar_reporte_completo();
```

**✨ Ventaja:** Puedes ejecutar estas funciones después de cada paso para verificar el progreso

---

### **PASO 0️⃣.5: Agregar funciones especializadas de puntos y tiers**
📁 Archivo: `supabase/sql/01_FUNCIONES_PUNTOS_TIERS.sql`

```
Propósito: Crear funciones para análisis, validación y reportes de cards
Tiempo: ~2 segundos
Dependencias: PASO 0 (funciones base)
```

**Pasos:**
1. Abre Supabase → SQL Editor → Nueva query
2. Copia contenido completo de `supabase/sql/01_FUNCIONES_PUNTOS_TIERS.sql`
3. Click "Run"
4. Verifica: ✅ "Funciones especializadas agregadas"

**📊 Funciones para Análisis:**
- `obtener_puntos_jugador(user_id)` - Ver puntos actuales y tier
- `calcular_progreso_tier(user_id)` - Progreso hacia próximo tier en %
- `obtener_estadisticas_completas(user_id)` - Todas las estadísticas
- `ranking_jugadores_puntos(limit)` - Top jugadores ordenados por puntos
- `puede_subir_tier(user_id)` - ¿Está listo para subir de tier?
- `contar_jugadores_por_tier()` - Distribución de jugadores por tier

**✅ Funciones para Validación:**
- `validar_integridad_card(user_id)` - Verificar consistencia de datos
- `resumen_ejecutivo_jugador(user_id)` - Resumen completo en una query

**📈 Funciones para Reportes:**
- `reporte_salud_sistema_cards()` - Salud general: total, activas, flagged, promedio
- `reporte_actividad_periodo(dias)` - Actividad por fecha (últimos N días)

**Ejemplos rápidos:**
```sql
SELECT * FROM obtener_puntos_jugador('00000000-0000-0000-0000-000000000001');
SELECT * FROM ranking_jugadores_puntos(10);
SELECT * FROM resumen_ejecutivo_jugador('user-id');
SELECT * FROM reporte_salud_sistema_cards();
```

---

### **PASO 1: Crear tabla base `public.card_player`**
📁 Archivo: `supabase/tables/card_player.sql`

```
Propósito: Crear tabla base con estructura JSONB y campos de validación
Tiempo: ~5 segundos
Dependencias: PASO 0 y 0.5 (opcional)
```

**Pasos:**
1. Abre Supabase → SQL Editor
2. Copia contenido completo de `supabase/tables/card_player.sql`
3. Click "Run"
4. Verifica: ✅ "Query successful"

**Verifica con:**
```sql
SELECT * FROM verificar_tabla_existe('public', 'card_player');
```

---

### **PASO 2: Crear schema `api` y tabla `api.carfutpro`**
📁 Archivo: `supabase/sql/migracion de cartas por jugador/MIGRACION_A_SCHEMA_API.sql`

```
Propósito: Crear infraestructura de API + RLS + vista api.usuarios
Tiempo: ~10 segundos
Dependencias: PASO 1 completado
```

**Pasos:**
1. Abre nuevo SQL tab en Supabase
2. Copia `MIGRACION_A_SCHEMA_API.sql`
3. Click "Run"
4. Verifica: ✅ "Migración completada" al final

**Cambios:**
- ✅ Schema `api` creado
- ✅ Tabla `api.carfutpro` con 20 columnas
- ✅ RLS habilitado con 4 políticas (SELECT, INSERT, UPDATE, DELETE)
- ✅ Vista `api.usuarios` desde `public.usuarios`
- ✅ Grants aplicados

---

### **PASO 3: Exponer schema `api` en API REST**
⚙️ Configuración manual (no SQL):

```
Propósito: Hacer que api.carfutpro sea accesible vía REST
Tiempo: ~30 segundos
```

**Pasos:**
1. Supabase Dashboard → Settings → API
2. Busca **"Exposed schemas"**
3. Verifica que `api` esté listado (si no está, agrégalo)
4. Guarda cambios
5. Espera ~2 minutos a que se propague

**Verifica con curl:**
```bash
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  "https://YOUR_PROJECT.supabase.co/rest/v1/api.carfutpro?select=*&limit=1"
```

Esperado: `200 OK` (aunque esté vacío o con error 401 si auth falla es normal en este punto)

---

### **PASO 4: Migrar datos existentes (si los hay)**
📁 Archivo: `supabase/sql/migracion de cartas por jugador/MIGRAR_PUBLIC_A_API.sql`

```
Propósito: Copiar registros de public.carfutpro → api.carfutpro
Tiempo: ~5 segundos (+ N según cantidad de registros)
Dependencias: PASO 1, 2, 3 completados
```

**Pasos:**
1. Abre nuevo SQL tab
2. Copia `MIGRAR_PUBLIC_A_API.sql`
3. Click "Run"
4. Verifica en la salida si muestra:
   - ✅ "Tabla origen public.carfutpro no existe" (normal si no hay datos previos)
   - O ✅ "Migración completada (si había registros)"

**Nota:** Si es la primera vez, probablemente no haya nada que migrar y el script informará que `public.carfutpro` no existe.

---

### **PASO 5: Crear vista `api.usuarios` desde `auth.users`**
📁 Archivo: `supabase/sql/vista api usuarios/VISTA_API_USUARIOS.sql`

```
Propósito: Exponer usuarios via REST API
Tiempo: ~2 segundos
Dependencias: PASO 2 completado
```

**Pasos:**
1. Abre nuevo SQL tab
2. Copia `VISTA_API_USUARIOS.sql`
3. Click "Run"
4. Verifica: ✅ "Query successful"

**Nota:** Este script sobrescribe la vista anterior (usa `DROP VIEW IF EXISTS CASCADE`)

---

### **PASO 6: Crear función `agregar_puntos_jugador()`**
📁 Archivo: `supabase/sql/agregar puntos por partido/AGREGAR_PUNTOS_JUGADOR.sql`

```
Propósito: Función para sumar puntos y recalcular tiers automáticamente
Tiempo: ~3 segundos
Dependencias: PASO 1 completado
```

**Pasos:**
1. Abre nuevo SQL tab
2. Copia `AGREGAR_PUNTOS_JUGADOR.sql`
3. Click "Run"
4. Verifica: ✅ "Query successful"

**Funcionalidad:**
- Suma puntos según tipo: `partido_ganado` (1.5x), `entrenamiento` (0.5x), `amistoso` (1x), etc.
- Recalcula tier automáticamente
- Crea fila si no existe

---

### **PASO 7: Crear funciones de verificación**
📁 Archivo: `supabase/funciones/verificacion_y_creacion.sql`

```
Propósito: Funciones helpers: card_existe(), obtener_o_crear_card(), validar_card()
Tiempo: ~2 segundos
Dependencias: PASO 1 completado
```

**Pasos:**
1. Abre nuevo SQL tab
2. Copia `verificacion_y_creacion.sql`
3. Click "Run"
4. Verifica: ✅ "Query successful"

---

## ✅ Descripción de Cada Script

| Paso | Archivo | Propósito | Estado |
|------|---------|----------|--------|
| 0️⃣ | `00_FUNCIONES_VERIFICACION.sql` | Funciones auxiliares de verificación | 📌 PRIMERO |
| 0️⃣.5 | `01_FUNCIONES_PUNTOS_TIERS.sql` | Análisis, validación y reportes | 📌 SEGUNDO |
| 1 | `card_player.sql` | Tabla base con JSONB | 📌 Obligatorio |
| 2 | `MIGRACION_A_SCHEMA_API.sql` | Schema + tablas + RLS | 📌 Obligatorio |
| 3 | *Settings* | Exponer schema en API | 📌 Obligatorio |
| 4 | `MIGRAR_PUBLIC_A_API.sql` | Copiar datos | ⚙️ Opcional |
| 5 | `VISTA_API_USUARIOS.sql` | Vista auth.users | ⚙️ Recomendado |
| 6 | `AGREGAR_PUNTOS_JUGADOR.sql` | Función puntos | ⚙️ Recomendado |
| 7 | `verificacion_y_creacion.sql` | Helpers | 💡 Utilidad |

---

## 🔍 Verificaciones Progresivas (Después de cada paso)

### ⭐ Reporte general (RECOMENDADO - ejecutar en cualquier momento):

```sql
-- Ver estado de TODOS los componentes
SELECT * FROM obtener_estado_sistema();

-- Output:
-- componente              | estado    | detalles
-- ----------------------|-----------|------------------
-- Tabla: public.card_player | ✅ Existe | 5 registros
-- Tabla: api.carfutpro   | ✅ Existe | 3 registros
-- Tabla: api.usuarios    | ✅ Existe | Vista
-- Función: agregar_puntos_jugador | ✅ Existe | PL/pgSQL
-- Schema: api            | ✅ Existe | Exposición REST
```

### Después del **PASO 1** (card_player):

```sql
-- Verificar tabla creada
SELECT * FROM verificar_tabla_existe('public', 'card_player');

-- Resultado esperado:
-- existe | schema_name | table_name | filas
-- true   | public      | card_player| 0
```

### Después del **PASO 2** (Schema API):

```sql
-- Verificar tablas del schema api
SELECT * FROM verificar_tabla_existe('api', 'carfutpro');
SELECT * FROM verificar_schema_existe('api');

-- Verificar RLS habilitado
SELECT * FROM verificar_rls_activo('api', 'carfutpro');

-- Resultado esperado:
-- rls_activo | policies_count | schema_name | table_name
-- true       | 4              | api         | carfutpro
```

### Después del **PASO 3** (Exponer schema):

---

## 🔍 Verificaciones Después de Cada Paso

### Después del **PASO 2** (Schema API):

```sql
-- Verificar tablas creadas
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema IN ('api', 'public') 
  AND table_name IN ('carfutpro', 'usuarios');

-- Resultado esperado:
-- api     | carfutpro
-- api     | usuarios (view)
-- public  | card_player
```

### Después del **PASO 3** (Exponer schema):

```bash
# Verificar que api.carfutpro es accesible
curl -X GET \
  "https://YOUR_PROJECT.supabase.co/rest/v1/api.carfutpro?select=count" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Esperado: 200 OK, {"count": 0} o similar
```

### Después del **PASO 6** (Función puntos):

```sql
-- Verificar función existe
SELECT proname, pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'agregar_puntos_jugador';

-- Resultado esperado: Función agregar_puntos_jugador visible
```

---

## 📚 Guías y Referencias Rápidas

### 🎬 Script de Demostración Interactiva
📁 Archivo: `supabase/sql/DEMO_FUNCIONES.sql`

**Descripción:** Script que muestra todos los ejemplos de uso de funciones sin modificar datos.

**Cómo usar:**
1. Abre Supabase → SQL Editor
2. Copia el contenido de `DEMO_FUNCIONES.sql`
3. Click "Run"
4. Lee la salida en la pestaña "Messages"
5. Copia y adapta los ejemplos que veas

**Incluye:**
- Demostraciones de funciones de verificación
- Ejemplos de análisis de puntos y tiers
- Scripts listos para copiar y pegar
- Casos de uso reales
- Dashboard completo del sistema
- Verificación de jugadores específicos
- Reportes ejecutivos

---

### 📖 Referencia Rápida de Funciones
📁 Archivo: `supabase/sql/REFERENCIA_RAPIDA_FUNCIONES.sql`

**Descripción:** Guía completa de TODAS las funciones con explicaciones, parámetros y ejemplos.

**Contenido:**
- ✅ 9 funciones de verificación básica (PASO 0)
- 📊 10 funciones especializadas (PASO 0.5)
- 🎯 Casos de uso por frontend
- 📋 Scripts listos para copiar
- 🔍 Cheat sheet rápido

**Cómo usar:**
- Ábrelo como referencia mientras usas las funciones
- Busca la función que necesitas
- Copia el ejemplo y adáptalo con tus datos

---

## 🆘 Troubleshooting

### ❌ Error: "relation api.carfutpro does not exist"

**Causa:** Schema `api` no está expuesto en API.

**Solución:**
1. Supabase → Settings → API → Exposed schemas
2. Asegúrate de que `api` esté en la lista
3. Guarda y espera 2 minutos

---

### ❌ Error: "permission denied for schema api"

**Causa:** Grants no aplicados correctamente.

**Solución:**
```sql
GRANT USAGE ON SCHEMA api TO anon, authenticated;
GRANT SELECT ON api.usuarios TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.carfutpro TO authenticated;
```

---

### ❌ Error: "ON CONFLICT constraint not found"

**Causa:** Tabla `api.carfutpro` sin PRIMARY KEY en `user_id`.

**Solución:**
```sql
ALTER TABLE api.carfutpro ADD PRIMARY KEY (user_id);
```

---

### ❌ Error: "function agregar_puntos_jugador does not exist"

**Causa:** Función no fue creada (ejecutar PASO 6).

**Solución:**
1. Abre `AGREGAR_PUNTOS_JUGADOR.sql`
2. Ejecuta en SQL Editor
3. Verifica: `\df agregar_puntos_jugador`

---

## 🎮 Comandos de Prueba Rápidos

### Test 1: Verificar tabla `card_player`

```sql
SELECT COUNT(*) FROM public.card_player;
-- Esperado: 0 (tabla vacía)
```

### Test 2: Verificar tabla `api.carfutpro`

```sql
SELECT COUNT(*) FROM api.carfutpro;
-- Esperado: 0 (tabla vacía)
```

### Test 3: Verificar función `agregar_puntos_jugador`

```sql
-- Crear usuario ficticio
INSERT INTO public.card_player (user_id, stats) 
VALUES ('00000000-0000-0000-0000-000000000001', '{"nombre": "Test"}')
ON CONFLICT DO NOTHING;

-- Agregar puntos
SELECT public.agregar_puntos_jugador(
  '00000000-0000-0000-0000-000000000001'::uuid, 
  'partido_ganado', 
  1
);

-- Esperado: { "success": true, "puntos_totales": 1, "tier_nuevo": "bronce", "subio_tier": false }
```

### Test 4: Verificar RLS en `api.carfutpro`

```sql
-- Ver políticas activas
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'carfutpro' AND schemaname = 'api';

-- Esperado: 4 políticas (SELECT, INSERT, UPDATE, DELETE)
```

### Test 5: Verificar REST API

```bash
# Necesitas: YOUR_PROJECT URL, YOUR_ANON_KEY
export PROJECT_URL="https://YOUR_PROJECT.supabase.co"
export ANON_KEY="YOUR_ANON_KEY"

# GET (lectura)
curl -X GET "$PROJECT_URL/rest/v1/api.carfutpro?select=*" \
  -H "Authorization: Bearer $ANON_KEY"

# POST (escritura)
curl -X POST "$PROJECT_URL/rest/v1/api.carfutpro" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{
    "user_id": "00000000-0000-0000-0000-000000000001",
    "nombre": "Juan",
    "puntos_totales": 50,
    "card_tier": "bronce"
  }'
```

---

## 📊 Resumen: Estructura Final Esperada

```
Supabase Project
├── public schema
│   ├── card_player (tabla base)
│   ├── carfutpro (tabla compatibilidad)
│   └── usuarios (tabla usuarios)
├── api schema
│   ├── carfutpro (tabla principal, expuesta en REST)
│   └── usuarios (vista desde auth.users)
├── Funciones
│   ├── agregar_puntos_jugador()
│   ├── card_existe()
│   ├── obtener_o_crear_card()
│   └── validar_card()
└── RLS Policies
    └── api.carfutpro: 4 políticas (SELECT, INSERT, UPDATE, DELETE)
```

---

## 🎯 Checklist de Implementación Completa

- [ ] PASO 1: `card_player.sql` ejecutado
- [ ] PASO 2: `MIGRACION_A_SCHEMA_API.sql` ejecutado
- [ ] PASO 3: Schema `api` expuesto en Settings → API
- [ ] PASO 4: `MIGRAR_PUBLIC_A_API.sql` ejecutado (si hay datos)
- [ ] PASO 5: `VISTA_API_USUARIOS.sql` ejecutado
- [ ] PASO 6: `AGREGAR_PUNTOS_JUGADOR.sql` ejecutado
- [ ] PASO 7: `verificacion_y_creacion.sql` ejecutado
- [ ] ✅ Test 1: `card_player` accesible
- [ ] ✅ Test 2: `api.carfutpro` accesible vía REST
- [ ] ✅ Test 3: Función `agregar_puntos_jugador()` disponible
- [ ] ✅ Test 4: RLS activo (4 políticas)
- [ ] ✅ Test 5: REST API respondiendo correctamente

---

## 🚀 Próximos Pasos

1. **Frontend:** Actualizar llamadas a usar `api.carfutpro` en lugar de `public.carfutpro`
2. **Integración:** Conectar función `agregar_puntos_jugador()` en eventos (partidos, entrenamientos)
3. **Testing:** Ejecutar suite de pruebas completa

---

**¿Preguntas?** Consulta el archivo de diagnóstico en `supabase/diagnostico_sistema.sql` para verificar estado completo.
