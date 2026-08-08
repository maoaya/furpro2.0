# 🎮 INSTRUCCIONES FINALES - CARD FUTPRO CON DATOS REALES

## 📋 Resumen de lo que se implementó

Tu card FUTPRO está configurada con **datos reales** (foto, edad, posición, pie, estatura, ciudad) en estilo FIFA con:
- ✅ Foto circular del usuario
- ✅ Nombre y ciudad
- ✅ Posición, pie dominante, estatura, edad
- ✅ Puntos iniciales: 50
- ✅ Tier inicial: BRONCE
- ✅ Label "CARD FUTPRO" en la tarjeta
- ✅ Botón "🏠 Continuar" → va a Home
- ✅ Stats: Partidos ganados, entrenamientos, amistosos, comportamiento

---

## 🔧 PASO 1: Ejecutar la Migración SQL en Supabase

### 1.1 Abre Supabase Dashboard
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto **futpro**
3. En la barra izquierda, ve a **SQL Editor**

### 1.2 Copia y ejecuta este SQL completo:

```sql
-- MIGRACIÓN A SCHEMA API PARA POSTGREST
-- Crea schema api, tabla api.carfutpro, view api.usuarios y políticas RLS.

-- 1) Crear schema api si no existe
CREATE SCHEMA IF NOT EXISTS api;

-- 2) Crear tabla api.carfutpro con datos reales
CREATE TABLE IF NOT EXISTS api.carfutpro (
  user_id UUID PRIMARY KEY,
  nombre VARCHAR(255),
  avatar_url TEXT,
  ciudad VARCHAR(120),
  pais VARCHAR(120),
  posicion VARCHAR(80),
  nivel_habilidad VARCHAR(40),
  equipo VARCHAR(120),
  edad INTEGER,
  pie VARCHAR(20),
  estatura NUMERIC(4,2),
  categoria VARCHAR(60),
  puntos_totales INTEGER DEFAULT 50 NOT NULL,
  card_tier VARCHAR(20) DEFAULT 'bronce' NOT NULL,
  partidos_ganados INTEGER DEFAULT 0 NOT NULL,
  entrenamientos INTEGER DEFAULT 0 NOT NULL,
  amistosos INTEGER DEFAULT 0 NOT NULL,
  puntos_comportamiento INTEGER DEFAULT 0 NOT NULL,
  ultima_actualizacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3) Habilitar RLS
ALTER TABLE api.carfutpro ENABLE ROW LEVEL SECURITY;

-- 4) Políticas RLS
DROP POLICY IF EXISTS api_card_select_own ON api.carfutpro;
DROP POLICY IF EXISTS api_card_insert_own ON api.carfutpro;
DROP POLICY IF EXISTS api_card_update_own ON api.carfutpro;
DROP POLICY IF EXISTS api_card_delete_own ON api.carfutpro;

CREATE POLICY api_card_select_own ON api.carfutpro FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY api_card_insert_own ON api.carfutpro FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY api_card_update_own ON api.carfutpro FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY api_card_delete_own ON api.carfutpro FOR DELETE USING (auth.uid() = user_id);

-- 5) Vista api.usuarios
DROP VIEW IF EXISTS api.usuarios CASCADE;
CREATE VIEW api.usuarios AS SELECT * FROM public.usuarios;

-- 6) Grants (permisos)
GRANT USAGE ON SCHEMA api TO anon, authenticated;
GRANT SELECT ON api.usuarios TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON api.carfutpro TO authenticated;

-- 7) Verificación
SELECT 'Tabla api.carfutpro creada' as status;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_schema='api' AND table_name='carfutpro' 
ORDER BY ordinal_position;
```

### 1.3 Ejecuta el script
- Haz clic en el botón **"Run"** (flecha verde)
- Espera a que se complete (debería ser exitoso sin errores)
- Si ves errores como "DUPLICATE KEY", ignóralos - significa que la tabla ya existe

---

## ✨ PASO 2: Flujo de Registro y Card

### 2.1 Inicia sesión en futpro.vip
```
https://futpro.vip
```

### 2.2 Haz clic en "Iniciar sesión con Google"
- Autentica con tu cuenta Google
- Se guardará tu foto (avatar_url) automáticamente

### 2.3 Completa el formulario "Registro Perfil"
**Campos que se capturan:**
- ✅ **Nombre**: Tu nombre completo
- ✅ **Foto/Avatar**: URL (se precargan automáticamente)
- ✅ **Edad**: Número entre 5-80
- ✅ **Pie dominante**: Derecho / Izquierdo / Ambidiestro
- ✅ **Estatura (m)**: Ej: 1.78
- ✅ **Ciudad**: Tu ciudad
- ✅ **País**: Tu país
- ✅ **Posición**: Portero, Defensa, Mediocampista, etc.
- ✅ **Equipo favorito**: Ej: Barcelona
- ✅ **Nivel de habilidad**: Principiante / Intermedio / Avanzado / Élite
- ✅ **Categoría**: infantil_femenina / infantil_masculina / etc.

### 2.4 Haz clic "Guardar y finalizar"
- Los datos se envían a `api.carfutpro`
- Se crea tu card automáticamente
- Puntos iniciales: **50**
- Tier inicial: **BRONCE**

---

## 🎯 PASO 3: Ver tu Card FIFA

### 3.1 Redirección automática a /perfil-card
Verás tu card estilo FIFA con:

```
╔════════════════════════════════╗
║     CARD FUTPRO                ║
║  Tier: BRONCE | 50 PUNTOS      ║
║  ┌──────────────┐              ║
║  │   [FOTO]     │  Circular    ║
║  │  del usuario │  con borde   ║
║  └──────────────┘              ║
║  Juan Pérez                    ║
║  Madrid (ciudad)               ║
║  ────────────────────────      ║
║  🎯 Posición: Delantero        ║
║  👣 Pie: Derecho               ║
║  🧍 Estatura: 1.78 m           ║
║  🎂 Edad: 25                   ║
║  ────────────────────────      ║
║  ⚽ Partidos: 0                ║
║  🏋️ Entrenamientos: 0          ║
║  🤝 Amistosos: 0               ║
║  ⭐ Comportamiento: 0          ║
║  ────────────────────────      ║
║      CARD FUTPRO • BRONCE      ║
╚════════════════════════════════╝

Botones:
  [🏠 Continuar] → va a /home
  [👤 Ver Perfil Completo]
```

### 3.2 Haz clic en "🏠 Continuar"
- Te llevaré automáticamente a la Home
- Tu card está creada y lista

---

## 🚀 PASO 4: Verificar en Producción

### 4.1 Deploy automático (ya completado)
- URL: https://futpro.vip
- Backend (Netlify Functions): ✅ Activo
- Supabase PostgREST: ✅ Apuntando a schema `api`

### 4.2 Probar endpoints REST (opcional, para debugging)
```bash
# GET tu card (requiere autenticación)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://qqrxetxcglwrejtblwut.supabase.co/rest/v1/carfutpro?user_id=eq.YOUR_USER_ID" \
  -H "apikey: YOUR_ANON_KEY"

# Debe devolver 200 OK con tu card
```

---

## 📊 Estructura de Puntos

| Acción | Puntos |
|--------|--------|
| Partido ganado | +3 |
| Entrenamiento completado | +1 |
| Amistoso jugado | +1 |
| Buen comportamiento | +1 |

### Tiers por Puntos
- **BRONCE**: 0-99 pts (inicial)
- **PLATA**: 100-249 pts
- **ORO**: 250-499 pts
- **DIAMANTE**: 500-999 pts
- **LEYENDA**: 1,000+ pts 🏆

---

## 🐛 Si algo falla

### Error al crear card (REST 406)
**Causa**: Schema API no estaba expuesto
**Solución**: Ejecuta la SQL migration completa arriba

### Error al cargar foto
**Causa**: URL de foto inválida
**Solución**: Revisa que tengas foto en Google Account; si no, carga en Avatar campo URL

### Card no se ve después de registrarse
**Causa**: RLS policies bloqueando SELECT
**Solución**: Ve a Supabase → Security → Row Level Security → Verifica que `api_card_select_own` esté activa

### Botón "Continuar" no funciona
**Causa**: Route `/home` no existe
**Solución**: Verifica que exista `src/pages/HomePage.jsx` en la app

---

## ✅ Checklist Final

- [ ] SQL migration ejecutada en Supabase sin errores
- [ ] Tabla `api.carfutpro` tiene columnas: avatar_url, ciudad, posicion, pie, estatura, edad, etc.
- [ ] RLS policies activas (4 políticas: SELECT, INSERT, UPDATE, DELETE)
- [ ] Schema API expuesto en PostgREST (revisar Settings → API Settings → Exposed schemas)
- [ ] Deploy a Netlify completado y futpro.vip activa
- [ ] Google OAuth funcionando (login exitoso)
- [ ] RegistroPerfil captura todos los campos
- [ ] Card se crea con datos reales automáticamente
- [ ] UI muestra "CARD FUTPRO" con foto circular y datos
- [ ] Botón "🏠 Continuar" redirige a /home

---

## 📞 Soporte

Si necesitas ayuda:
1. Abre la consola del navegador (F12) y copia errores en rojo
2. Revisa el log de Netlify (Deploys → Build logs)
3. Verifica Supabase SQL Editor para confirmar la tabla existe

¡Tu CARD FUTPRO está lista! 🎮⚽
