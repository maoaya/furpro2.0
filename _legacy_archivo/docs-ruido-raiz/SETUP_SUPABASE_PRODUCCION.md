# 🚀 SETUP SUPABASE PRODUCCIÓN - FutPro 2.0

## ✅ ANTES DE CUALQUIER COSA

El código ya está configurado correctamente. Solo necesitas ejecutar estos SQL en orden:

---

## 📋 ORDEN DE EJECUCIÓN EN SUPABASE SQL EDITOR

### 1️⃣ PASO 1: Funciones de Verificación
**Archivo:** `supabase/sql/00_FUNCIONES_VERIFICACION.sql`

Copia TODO el contenido y ejecuta en Supabase SQL Editor.

```
Tiempo: ~3 segundos
Dependencias: Ninguna
```

---

### 2️⃣ PASO 2: Funciones de Puntos y Tiers
**Archivo:** `supabase/sql/01_FUNCIONES_PUNTOS_TIERS.sql`

Copia TODO el contenido y ejecuta.

```
Tiempo: ~2 segundos
Dependencias: PASO 1
```

---

### 3️⃣ PASO 3: Funciones de Eventos y Logros
**Archivo:** `supabase/sql/02_FUNCIONES_EVENTOS_LOGROS.sql`

Copia TODO el contenido y ejecuta.

```
Tiempo: ~2 segundos
Dependencias: PASO 2
```

---

### 4️⃣ PASO 4: Setup Completo (Schema, Tabla, RLS)
**Archivo:** `supabase/sql/FIX_PRODUCCION_AHORA.sql`

Copia TODO el contenido y ejecuta.

```
Tiempo: ~5 segundos
Dependencias: PASO 3
Crea:
  - Schema api
  - Tabla api.carfutpro (donde se guardan las cards)
  - RLS habilitado
  - Grants
  - Storage bucket avatars
```

---

### 5️⃣ PASO 5: Vistas Especializadas (Opcional pero recomendado)
**Archivo:** `supabase/sql/VISTAS_ESPECIALIZADAS.sql`

Copia TODO el contenido y ejecuta.

```
Tiempo: ~3 segundos
Dependencias: PASO 4
Crea vistas para ranking, estadísticas, etc.
```

---

### 6️⃣ PASO 6: CRÍTICO - Exponer Schema `api` en REST API
**ESTO NO ES SQL - Es configuración manual**

1. Ve a **Supabase Dashboard**
2. Click en **Settings** (engranaje abajo a la izquierda)
3. Busca **API** en el menú izquierdo
4. Busca **"Exposed schemas"**
5. Verifica que `api` está listado
6. Si no está, haz click en el input y agrega `api`
7. Guarda cambios
8. **ESPERA 2 MINUTOS** - Es importante que se propague

---

## 🔗 RUTAS EN EL CÓDIGO

El código ya apunta correctamente a:

### Login / Registro
- **Ruta:** `/login` o `/registro`
- **Tabla:** `api.carfutpro` (insert/update automático)
- **Función:** Crea registro con `puntos_totales: 0` y `card_tier: 'Bronce'`

### OAuth Callback
- **Ruta:** `/auth/callback`
- **Acción:** Verifica si usuario tiene card en `api.carfutpro`
- **Si no existe:** Redirige a `/registro` o `/formulario-registro`
- **Si existe:** Redirige a `/perfil-card` o `/home`

### Card del Jugador
- **Ruta:** `/perfil-card`
- **Lee de:** `api.carfutpro`
- **Muestra:** Nombre, puntos, tier, posición, etc.

### Feed Principal
- **Ruta:** `/home` o `/feed`
- **Lee de:** Varias vistas (ranking, estadísticas)

---

## 📊 ESTRUCTURA DE TABLA `api.carfutpro`

```
id                      UUID (PK)
user_id                 UUID (FK auth.users, UNIQUE)
email                   VARCHAR(255)
nombre                  VARCHAR(255)
apellido                VARCHAR(255)
avatar_url              VARCHAR(500)
ciudad                  VARCHAR(100)
pais                    VARCHAR(100)
posicion                VARCHAR(50)
posicion_favorita       VARCHAR(50)
nivel_habilidad         VARCHAR(50)
equipo                  VARCHAR(100)
equipo_favorito         VARCHAR(100)
edad                    INTEGER
peso                    NUMERIC
altura                  NUMERIC
estatura                VARCHAR(20)
pie                     VARCHAR(20)
pierna_dominante        VARCHAR(20)
categoria               VARCHAR(50)
telefono                VARCHAR(50)
disponibilidad_juego    TEXT

-- STATS DE LA CARD
puntos_totales          INTEGER (DEFAULT 0)
card_tier               VARCHAR(50) (DEFAULT 'Bronce')
partidos_ganados        INTEGER (DEFAULT 0)
entrenamientos          INTEGER (DEFAULT 0)
amistosos               INTEGER (DEFAULT 0)
puntos_comportamiento   INTEGER (DEFAULT 0)

-- TIMESTAMPS
ultima_actualizacion    TIMESTAMP
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

---

## 🎯 TIERS DEL SISTEMA

```
Bronce:   0 - 99 puntos
Plata:    100 - 199 puntos
Oro:      200 - 499 puntos
Diamante: 500 - 999 puntos
Leyenda:  1000+ puntos
```

---

## ✨ FUNCIONES DISPONIBLES EN SUPABASE

### Para Análisis
```sql
SELECT * FROM obtener_puntos_jugador('user-id');
SELECT * FROM calcular_progreso_tier('user-id');
SELECT * FROM ranking_jugadores_puntos(10);
SELECT * FROM reporte_salud_sistema_cards();
```

### Para Agregar Puntos (desde Backend)
```sql
SELECT agregar_puntos_jugador('user-id', 'partido_ganado', 3);
SELECT agregar_puntos_jugador('user-id', 'entrenamiento', 1);
```

---

## 🧪 VERIFICACIÓN FINAL

Ejecuta esto en SQL Editor para verificar todo:

```sql
SELECT * FROM obtener_estado_sistema();
```

Debería mostrar:
- ✅ Schema api existe
- ✅ Tabla api.carfutpro existe con X columnas
- ✅ Vista api.usuarios existe
- ✅ RLS habilitado
- ✅ Funciones cargadas

---

## 🆘 SI ALGO FALLA

Si al registrarse dice **"relation 'api.carfutpro' does not exist"**:

1. Verifica que ejecutaste PASO 4 (FIX_PRODUCCION_AHORA.sql)
2. Verifica que ejecutaste PASO 6 (Exponer schema `api`)
3. Espera 2-3 minutos y recarga la página
4. Si aún falla, ejecuta en SQL Editor:

```sql
SELECT * FROM verificar_tabla_existe('api', 'carfutpro');
```

Si dice `false`, vuelve a ejecutar FIX_PRODUCCION_AHORA.sql

---

## 📝 RESUMEN

**TODO YA ESTÁ CREADO EN SUPABASE/SQL/**

Solo necesitas:
1. ✅ Copiar y ejecutar los 5 SQL en orden
2. ✅ Exponer schema `api` en Settings → API
3. ✅ Hacer redeploy (npm run build + netlify deploy)

**El código ya apunta correctamente a las rutas y tablas.**
