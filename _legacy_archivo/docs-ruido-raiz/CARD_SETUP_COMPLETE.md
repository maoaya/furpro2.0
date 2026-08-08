# 🎮 INSTRUCCIONES PARA ACTIVAR CARD FUTPRO - PASO A PASO

## ✅ Estado Actual del Sistema

Tu aplicación FutPro 2.0 ya tiene implementado:

- ✅ **CardManager.js** - Servicio completo de gestión de cards
- ✅ **AuthCallback.jsx** - Manejo de OAuth con creación de card automática
- ✅ **PerfilCard.jsx** - Visualización de card con tiers y puntos
- ✅ **FormularioRegistroCompleto.jsx** - Registro con todos los campos (categoria, peso, altura, ubicación, etc.)
- ✅ **Schema SQL** - Tabla carfutpro con sistema de puntos y tiers (bronce→plata→oro→diamante→leyenda)
- ✅ **RLS Policies** - Control de acceso por usuario
- ✅ **Funciones PostgreSQL** - agregar_puntos_card() y actualizar_card_tier()

---

## 🚀 PASO 1: Verificar que la Tabla SQL está Creada

### En Supabase:
1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut
2. Click en **SQL Editor**
3. Copia y ejecuta esta consulta:

```sql
-- Verificar que la tabla existe
SELECT table_schema, table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'carfutpro'
ORDER BY ordinal_position
LIMIT 20;
```

**Resultado esperado:** Debes ver columnas como:
- user_id (uuid)
- nombre (varchar)
- avatar_url (text)
- ciudad, pais, edad, peso, estatura, categoria, pie
- puntos_totales (integer)
- card_tier (varchar)
- etc.

---

## 🔧 PASO 2: Si la Tabla NO Existe - Ejecutar SQL

Si la consulta anterior no retorna resultados, copia y ejecuta esto en el SQL Editor:

```sql
-- Crear tabla carfutpro si no existe
CREATE TABLE IF NOT EXISTS public.carfutpro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información personal
  nombre VARCHAR(100) NOT NULL DEFAULT 'Jugador',
  apellido VARCHAR(100) DEFAULT '',
  avatar_url TEXT DEFAULT NULL,
  ciudad VARCHAR(100) DEFAULT '',
  pais VARCHAR(100) DEFAULT '',
  edad INTEGER DEFAULT NULL,
  altura VARCHAR(10) DEFAULT '',
  peso VARCHAR(10) DEFAULT '',
  
  -- Datos del jugador
  categoria VARCHAR(50) DEFAULT 'masculina',
  posicion_favorita VARCHAR(100) DEFAULT 'Flexible',
  nivel_habilidad VARCHAR(50) DEFAULT 'Principiante',
  pierna_dominante VARCHAR(20) DEFAULT 'Derecha',
  disponibilidad_juego VARCHAR(200) DEFAULT 'Por coordinar',
  equipo VARCHAR(100) DEFAULT '—',
  
  -- Sistema de puntos
  puntos_totales INTEGER NOT NULL DEFAULT 0,
  puntos_partidos INTEGER NOT NULL DEFAULT 0,
  puntos_entrenamientos INTEGER NOT NULL DEFAULT 0,
  puntos_comportamiento INTEGER NOT NULL DEFAULT 0,
  puntos_amistosos INTEGER NOT NULL DEFAULT 0,
  
  -- Estadísticas
  partidos_ganados INTEGER NOT NULL DEFAULT 0,
  partidos_jugados INTEGER NOT NULL DEFAULT 0,
  entrenamientos_realizados INTEGER NOT NULL DEFAULT 0,
  amistosos_jugados INTEGER NOT NULL DEFAULT 0,
  goles INTEGER NOT NULL DEFAULT 0,
  asistencias INTEGER NOT NULL DEFAULT 0,
  
  -- Card tier
  card_tier VARCHAR(20) NOT NULL DEFAULT 'bronce',
  
  -- Timestamps
  creada_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizada_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT card_tier_valid CHECK (card_tier IN ('bronce', 'plata', 'oro', 'diamante', 'leyenda'))
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_carfutpro_user_id ON public.carfutpro(user_id);
CREATE INDEX IF NOT EXISTS idx_carfutpro_card_tier ON public.carfutpro(card_tier);
CREATE INDEX IF NOT EXISTS idx_carfutpro_puntos ON public.carfutpro(puntos_totales DESC);

-- Tabla de historial de puntos
CREATE TABLE IF NOT EXISTS public.card_puntos_historial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  puntos INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  descripcion TEXT DEFAULT '',
  card_tier_nuevo VARCHAR(20) DEFAULT 'bronce',
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historial_user ON public.card_puntos_historial(user_id);
CREATE INDEX IF NOT EXISTS idx_historial_tipo ON public.card_puntos_historial(tipo);

-- Función para actualizar tier automáticamente
CREATE OR REPLACE FUNCTION public.actualizar_card_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.puntos_totales < 500 THEN
    NEW.card_tier := 'bronce';
  ELSIF NEW.puntos_totales < 1000 THEN
    NEW.card_tier := 'plata';
  ELSIF NEW.puntos_totales < 2000 THEN
    NEW.card_tier := 'oro';
  ELSIF NEW.puntos_totales < 5000 THEN
    NEW.card_tier := 'diamante';
  ELSE
    NEW.card_tier := 'leyenda';
  END IF;
  
  NEW.actualizada_en := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_actualizar_card_tier ON public.carfutpro;
CREATE TRIGGER trg_actualizar_card_tier
BEFORE UPDATE ON public.carfutpro
FOR EACH ROW
EXECUTE FUNCTION public.actualizar_card_tier();

-- Función para agregar puntos
CREATE OR REPLACE FUNCTION public.agregar_puntos_card(
  p_user_id UUID,
  p_puntos INTEGER,
  p_tipo VARCHAR(50),
  p_descripcion TEXT DEFAULT ''
)
RETURNS TABLE(
  exito BOOLEAN,
  nuevos_puntos INTEGER,
  nuevo_tier VARCHAR(20),
  mensaje TEXT
) AS $$
DECLARE
  v_card_id UUID;
  v_puntos_anteriores INTEGER;
BEGIN
  SELECT id INTO v_card_id FROM public.carfutpro WHERE user_id = p_user_id FOR UPDATE;
  
  IF v_card_id IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'bronce'::VARCHAR, 'Card no encontrada'::TEXT;
    RETURN;
  END IF;
  
  SELECT puntos_totales INTO v_puntos_anteriores FROM public.carfutpro WHERE id = v_card_id;
  
  UPDATE public.carfutpro SET
    puntos_totales = puntos_totales + p_puntos,
    puntos_partidos = CASE WHEN p_tipo = 'partido' THEN puntos_partidos + p_puntos ELSE puntos_partidos END,
    puntos_entrenamientos = CASE WHEN p_tipo = 'entrenamiento' THEN puntos_entrenamientos + p_puntos ELSE puntos_entrenamientos END,
    puntos_comportamiento = CASE WHEN p_tipo = 'comportamiento' THEN puntos_comportamiento + p_puntos ELSE puntos_comportamiento END,
    puntos_amistosos = CASE WHEN p_tipo = 'amistoso' THEN puntos_amistosos + p_puntos ELSE puntos_amistosos END,
    partidos_ganados = CASE WHEN p_tipo = 'partido' THEN partidos_ganados + 1 ELSE partidos_ganados END,
    partidos_jugados = CASE WHEN p_tipo = 'partido' THEN partidos_jugados + 1 ELSE partidos_jugados END,
    entrenamientos_realizados = CASE WHEN p_tipo = 'entrenamiento' THEN entrenamientos_realizados + 1 ELSE entrenamientos_realizados END,
    amistosos_jugados = CASE WHEN p_tipo = 'amistoso' THEN amistosos_jugados + 1 ELSE amistosos_jugados END
  WHERE id = v_card_id;
  
  INSERT INTO public.card_puntos_historial (user_id, puntos, tipo, descripcion, card_tier_nuevo)
  SELECT p_user_id, p_puntos, p_tipo, p_descripcion, card_tier
  FROM public.carfutpro WHERE id = v_card_id;
  
  RETURN QUERY
  SELECT 
    TRUE,
    (SELECT puntos_totales FROM public.carfutpro WHERE id = v_card_id),
    (SELECT card_tier FROM public.carfutpro WHERE id = v_card_id),
    'Puntos agregados correctamente'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Habilitar RLS
ALTER TABLE public.carfutpro ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS users_can_select_own_card ON public.carfutpro;
CREATE POLICY users_can_select_own_card
  ON public.carfutpro FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_can_insert_own_card ON public.carfutpro;
CREATE POLICY users_can_insert_own_card
  ON public.carfutpro FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_can_update_own_card ON public.carfutpro;
CREATE POLICY users_can_update_own_card
  ON public.carfutpro FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_can_delete_own_card ON public.carfutpro;
CREATE POLICY users_can_delete_own_card
  ON public.carfutpro FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant permisos
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carfutpro TO authenticated;
GRANT SELECT, INSERT ON public.card_puntos_historial TO authenticated;

-- Verificación final
SELECT 'Tabla carfutpro creada correctamente' as status;
```

---

## 🧪 PASO 3: Probar el Flujo Completo

### Crear una card de prueba:

```sql
-- Reemplaza 'TU_USER_ID' con un UUID real
INSERT INTO public.carfutpro (
  user_id,
  nombre,
  categoria,
  puntos_totales,
  card_tier
) VALUES (
  'TU_USER_ID',
  'Prueba',
  'masculina',
  100,
  'bronce'
) ON CONFLICT (user_id) DO UPDATE SET
  nombre = 'Prueba',
  puntos_totales = 100,
  card_tier = 'bronce';

-- Verificar que se creó
SELECT * FROM public.carfutpro WHERE nombre = 'Prueba';
```

---

## 🌐 PASO 4: Verificar Variables de Entorno en Netlify

1. Ve a: https://app.netlify.com/sites/futprovip/settings/env
2. Verifica que existan estas variables:
   - `VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `VITE_GOOGLE_CLIENT_ID=760210878835-...`

Si faltan, agrégalas manualmente.

---

## ✅ FLUJO DE REGISTRO Y CREACIÓN DE CARD

### Cuando un usuario se registra:

1. **FormularioRegistroCompleto.jsx**
   - Captura: nombre, categoria, peso, altura, ubicación, foto, pie, edad, etc.
   - Auto-guarda en `localStorage.draft_carfutpro`
   - Geolocaliza por IP para obtener ciudad/país automáticamente

2. **OAuth con Google**
   - Usuario hace login con Google
   - Se redirige a `/auth/callback`

3. **AuthCallback.jsx** (NUEVO)
   - Obtiene sesión OAuth
   - Lee `pendingProfileData` y `draft_carfutpro` de localStorage
   - Sube foto a Supabase Storage si es necesario
   - Usa **CardManager.getOrCreateCard()** para crear/actualizar card
   - Redirige a `/perfil-card`

4. **PerfilCard.jsx**
   - Carga card desde Supabase
   - Muestra tier, puntos, progreso hacia siguiente tier
   - Calcula tier automáticamente con CardManager
   - Usa CARD_TIERS para colores y etiquetas

---

## 📊 TIERS Y PUNTOS

```
FUTPRO:    0-99 puntos    ⭐ (inicial)
BRONCE:    100-499 puntos  🥉
PLATA:     500-999 puntos  🥈
ORO:       1000-1999 puntos 🥇
DIAMANTE:  2000-4999 puntos 💎
LEYENDA:   5000+ puntos    👑
```

Cada tier sube automáticamente cuando se agregan puntos.

---

## 🔧 FUNCIÓN PARA AGREGAR PUNTOS

Desde cualquier parte de tu app:

```javascript
import cardManager from '../services/CardManager'

// Agregar puntos a usuario
const resultado = await cardManager.addPoints(
  userId,           // UUID del usuario
  10,               // Cantidad de puntos
  'partido',        // Tipo: 'partido', 'entrenamiento', 'comportamiento', 'amistoso'
  'Ganó un amistoso' // Descripción (opcional)
)

console.log(resultado)
// { exito: true, nuevos_puntos: 110, nuevo_tier: 'bronce', mensaje: '...' }
```

---

## 🎯 CHECKLIST DE VALIDACIÓN

- [ ] Tabla `carfutpro` existe en schema `public`
- [ ] Todas las columnas necesarias están presentes
- [ ] RLS policies están habilitadas
- [ ] Funciones PostgreSQL compiladas sin errores
- [ ] Variables de entorno en Netlify están completas
- [ ] Deploy en Netlify completado
- [ ] Avatar storage bucket `avatars` existe
- [ ] CardManager.js importado en los componentes correctos
- [ ] AuthCallback redirige correctamente a `/perfil-card`
- [ ] PerfilCard muestra la card con datos corrector

---

## 🚀 PRÓXIMOS PASOS

1. Ejecuta el SQL del PASO 2 en Supabase
2. Verifica variables de entorno en Netlify (PASO 4)
3. Prueba registro completo: https://futpro.vip/registro
4. Completa el formulario con todos los datos
5. Conecta con Google OAuth
6. Verifica que aparezca tu card en `/perfil-card`

¡Listo! 🎉

---

**Para dudas o problemas, revisa los console.log en DevTools (F12) para ver dónde falla.**
