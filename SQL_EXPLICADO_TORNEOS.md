# 🏆 SQL Sistema de Torneos - Documentación Detallada

## 📋 Tabla de Contenidos
1. [Tablas de Configuración](#tablas-de-configuración)
2. [Tablas de Participantes](#tablas-de-participantes)
3. [Tablas de Partidos y Resultados](#tablas-de-partidos-y-resultados)
4. [Tabla de Sanciones](#tabla-de-sanciones)
5. [Tabla de Notificaciones](#tabla-de-notificaciones)
6. [Funciones PL/pgSQL](#funciones-plpgsql)
7. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 📊 Tablas de Configuración

### 1️⃣ `tournaments` - Configuración del Torneo

```sql
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- CREADOR
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- DATOS BÁSICOS
  name VARCHAR(255) NOT NULL,          -- Ej: "Copa Master 2026"
  description TEXT,                     -- Descripción larga
  category VARCHAR(50),                 -- Ej: 'masculina', 'femenina', 'mixta'
  tournament_type VARCHAR(50),          -- Ej: 'futbol11', 'futbol7', 'futsal'
  
  -- EDADES
  min_age INT,                          -- Edad mínima
  max_age INT,                          -- Edad máxima
  
  -- UBICACIÓN
  address TEXT,                         -- Dirección completa
  city VARCHAR(100),                    -- Ciudad
  country VARCHAR(100),                 -- País
  coordinates JSONB,                    -- {lat: -74.1234, lng: 4.5678}
  
  -- CONFIGURACIÓN DE EQUIPOS
  max_players_per_team INT DEFAULT 11,  -- 11 para futbol11, 7 para futsal, etc
  max_teams INT,                        -- Máximo de equipos (16, 32, 64)
  min_teams INT DEFAULT 2,              -- Mínimo de equipos
  
  -- INSCRIPCIÓN Y PAGOS
  registration_type VARCHAR(20) DEFAULT 'free',  -- 'free' o 'paid'
  registration_fee DECIMAL(10, 2) DEFAULT 0,     -- Costo por equipo
  currency VARCHAR(10) DEFAULT 'COP',            -- Moneda según país
  registration_start TIMESTAMP,         -- Cuándo abre inscripción
  registration_end TIMESTAMP,           -- Cuándo cierra inscripción
  
  -- FECHAS DEL TORNEO
  tournament_start TIMESTAMP,           -- Fecha inicio
  tournament_end TIMESTAMP,             -- Fecha fin
  
  -- HORARIOS DE PARTIDOS (JSONB)
  match_schedule JSONB,                 -- [{day: 'lunes', time: '18:00'}, ...]
  
  -- REGLAS
  rules TEXT,                           -- Reglas del torneo
  scoring_system VARCHAR(20) DEFAULT 'standard',
    -- 'standard': Victoria=3pts, Empate=1pt, Derrota=0pts
    -- 'zero_draw': Si empatan → Penaltis (1pt c/u + 1pt ganador)
    -- 'repechaje': Los mejores por goles pasan
  
  has_penalties BOOLEAN DEFAULT true,   -- ¿Permite penaltis?
  penalties_distribution VARCHAR(50),   -- 'winner_takes_all' o 'split_points'
  allow_repechaje BOOLEAN DEFAULT false,-- ¿Modo repechaje?
  
  -- TRANSMISIÓN EN VIVO
  requires_streaming BOOLEAN DEFAULT true,  -- Requiere transmisión para ser oficial
  min_streams_required INT DEFAULT 1,       -- Número mínimo de transmisiones
  
  -- ESTADO DEL TORNEO
  status VARCHAR(20) DEFAULT 'draft',
    -- 'draft': En edición
    -- 'registration_open': Abierto para equipos
    -- 'registration_closed': Cerrada inscripción
    -- 'in_progress': Torneos en curso
    -- 'finished': Finalizado
    -- 'cancelled': Cancelado
  
  phase VARCHAR(30) DEFAULT 'registration',
    -- 'registration': Inscripción abierta
    -- 'groups': Fase de grupos
    -- 'playoffs': Eliminatorias
    -- 'semifinals': Semifinales
    -- 'final': Final
    -- 'finished': Completado
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);
```

**Ejemplo de Inserción:**
```sql
INSERT INTO tournaments (
  creator_id, name, category, min_age, max_age, 
  address, city, country, max_teams, tournament_type,
  registration_type, registration_fee, currency,
  tournament_start, requires_streaming
) VALUES (
  'user-uuid-123',
  'Copa Master 2026',
  'masculina',
  18, 40,
  'Estadio El Campín, Bogotá',
  'Bogotá', 'Colombia',
  16,
  'futbol11',
  'paid',
  50.00,
  'COP',
  '2026-02-01 08:00:00',
  true
);
```

---

## 👥 Tablas de Participantes

### 2️⃣ `tournament_registrations` - Inscripción de Equipos

```sql
CREATE TABLE tournament_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  
  -- ESTADO DE LA INSCRIPCIÓN
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending': Esperando confirmación
    -- 'accepted': Aceptado
    -- 'rejected': Rechazado
    -- 'paid': Pago confirmado
    -- 'cancelled': Cancelado
  
  payment_status VARCHAR(20) DEFAULT 'unpaid',
    -- 'unpaid': Sin pagar
    -- 'paid': Pagado
    -- 'refunded': Reembolsado
  
  payment_date TIMESTAMP,
  payment_reference VARCHAR(100),      -- ID de transacción (Stripe, PayPal)
  
  -- DATOS DEL CAPITÁN
  captain_id UUID REFERENCES auth.users(id),
  captain_email VARCHAR(255),
  captain_phone VARCHAR(20),
  
  -- CONVOCATORIA INICIAL
  initial_roster JSONB,                -- [{player_id, nombre, posicion}, ...]
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tournament_id, team_id)
);
```

### 3️⃣ `tournament_invitations` - Invitaciones a Equipos/Fans

```sql
CREATE TABLE tournament_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id),
  invited_by UUID REFERENCES auth.users(id),
  
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending': Esperando respuesta
    -- 'accepted': Aceptó participar
    -- 'rejected': Rechazó
    -- 'expired': Expiró (7 días)
  
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 DAYS'),
  responded_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tournament_id, team_id)
);
```

**Caso de Uso: Notificar a fans del creador**
```sql
-- Buscar usuarios que sean fans del creador
SELECT u.id FROM users u
WHERE u.id IN (
  SELECT follower_id FROM follows WHERE following_id = 'creator-uuid'
)
-- Invitar a participar en el torneo
INSERT INTO tournament_invitations (tournament_id, team_id, invited_by)
SELECT 'tournament-uuid', t.id, 'creator-uuid'
FROM teams t
WHERE t.created_by IN (
  SELECT follower_id FROM follows WHERE following_id = 'creator-uuid'
);
```

---

## 3️⃣ Tablas de Partidos y Resultados

### 4️⃣ `tournament_groups` - Grupos del Torneo

```sql
CREATE TABLE tournament_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  group_name VARCHAR(10),               -- 'A', 'B', 'C', 'D'
  group_order INT,                      -- Orden de visualización
  
  UNIQUE(tournament_id, group_name)
);
```

### 5️⃣ `tournament_group_teams` - Equipos en Grupos con Estadísticas

```sql
CREATE TABLE tournament_group_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES tournament_groups(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES tournament_registrations(id),
  
  -- ESTADÍSTICAS DEL GRUPO
  matches_played INT DEFAULT 0,         -- Partidos jugados
  wins INT DEFAULT 0,                   -- Victorias
  draws INT DEFAULT 0,                  -- Empates
  losses INT DEFAULT 0,                 -- Derrotas
  goals_for INT DEFAULT 0,              -- Goles a favor
  goals_against INT DEFAULT 0,          -- Goles en contra
  goal_difference INT,                  -- Auto-calculado: goles_a_favor - goles_en_contra
  points INT DEFAULT 0,                 -- Puntos totales
  penalty_wins INT DEFAULT 0,           -- Victorias por penaltis (para sistema 0-empate)
  
  -- DISCIPLINA
  yellow_cards INT DEFAULT 0,           -- Tarjetas amarillas
  red_cards INT DEFAULT 0,              -- Tarjetas rojas
  
  position INT,                         -- Posición en la tabla (1=primero, 2=segundo, etc)
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(group_id, team_id)
);

-- NOTA: El campo goal_difference se calcula AUTOMÁTICAMENTE
-- No necesita ser insertado manualmente
```

**Visualización de Tabla de Posiciones:**
```sql
SELECT 
  position,
  t.name AS equipo,
  matches_played,
  wins,
  draws,
  losses,
  goals_for,
  goals_against,
  goal_difference,
  points,
  penalty_wins
FROM tournament_group_teams tgt
JOIN teams t ON t.id = tgt.team_id
WHERE group_id = 'group-uuid'
ORDER BY position ASC;
```

### 6️⃣ `tournament_matches` - Partidos a Jugar

```sql
CREATE TABLE tournament_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  group_id UUID REFERENCES tournament_groups(id),      -- Si está en fase de grupos
  bracket_id UUID REFERENCES tournament_brackets(id),  -- Si está en eliminatorias
  
  -- EQUIPOS
  home_team_id UUID REFERENCES teams(id),
  away_team_id UUID REFERENCES teams(id),
  
  -- RESULTADO (se llena cuando hay reporte arbitral)
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0,
  
  -- PENALTIS
  home_penalties INT,
  away_penalties INT,
  decided_by_penalties BOOLEAN DEFAULT false,
  
  -- ÁRBITRO ASIGNADO
  referee_id UUID REFERENCES auth.users(id),
  referee_assigned_at TIMESTAMP,
  
  -- FECHA Y HORA
  match_date TIMESTAMP,
  match_round INT,                      -- Jornada (1, 2, 3...)
  
  -- ESTADO
  status VARCHAR(20) DEFAULT 'scheduled',
    -- 'scheduled': Programado
    -- 'in_progress': En vivo
    -- 'finished': Completado
    -- 'cancelled': Cancelado
    -- 'postponed': Pospuesto
  
  -- TRANSMISIÓN EN VIVO
  stream_id UUID REFERENCES live_streams(id),
  was_streamed BOOLEAN DEFAULT false,   -- ¿Fue transmitido?
  
  -- REPORTE ARBITRAL
  report_submitted BOOLEAN DEFAULT false,
  report_submitted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7️⃣ `tournament_brackets` - Llaves/Eliminatorias

```sql
CREATE TABLE tournament_brackets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  
  -- RONDA
  round_name VARCHAR(50),               -- 'octavos', 'cuartos', 'semifinal', 'final', 'tercer_lugar'
  round_order INT,                      -- Orden: 1 (octavos), 2 (cuartos), etc
  match_number INT,                     -- Número del partido en la ronda
  
  -- EQUIPOS
  home_team_id UUID REFERENCES teams(id),
  away_team_id UUID REFERENCES teams(id),
  
  -- RESULTADO
  home_score INT,
  away_score INT,
  winner_id UUID REFERENCES teams(id),
  
  -- PENALTIS
  home_penalties INT,
  away_penalties INT,
  decided_by_penalties BOOLEAN DEFAULT false,
  
  -- PROGRAMACIÓN
  match_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'scheduled',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ejemplo: Generar bracket automáticamente para 16 equipos
-- Octavos de final = 8 partidos
-- Cuartos de final = 4 partidos
-- Semifinales = 2 partidos
-- Final = 1 partido
```

---

## 📊 Tabla de Resultados y Estadísticas

### 8️⃣ `referee_reports` - Reporte Arbitral (Lo más importante)

```sql
CREATE TABLE referee_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES tournament_matches(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES auth.users(id),
  tournament_id UUID REFERENCES tournaments(id),
  
  -- RESULTADO FINAL
  home_score INT NOT NULL,              -- Goles equipo local
  away_score INT NOT NULL,              -- Goles equipo visitante
  
  -- PENALTIS (si aplica)
  home_penalties INT,
  away_penalties INT,
  decided_by_penalties BOOLEAN DEFAULT false,
  
  -- GOLES (JSONB - Array)
  goals JSONB,
  -- Formato: [
  --   {player_id: 'uuid', team_id: 'uuid', minute: 15, type: 'normal'},
  --   {player_id: 'uuid', team_id: 'uuid', minute: 45, type: 'penalty'},
  --   {player_id: 'uuid', team_id: 'uuid', minute: 89, type: 'own_goal'}
  -- ]
  
  -- ASISTENCIAS (JSONB - Array)
  assists JSONB,
  -- Formato: [
  --   {player_id: 'uuid', team_id: 'uuid', minute: 14}
  -- ]
  
  -- TARJETAS (JSONB - Array)
  yellow_cards JSONB,
  -- Formato: [
  --   {player_id: 'uuid', team_id: 'uuid', minute: 30, reason: 'simulación'}
  -- ]
  
  red_cards JSONB,
  -- Formato: [
  --   {player_id: 'uuid', team_id: 'uuid', minute: 45, reason: 'roja directa', type: 'direct'}
  --   {player_id: 'uuid', team_id: 'uuid', minute: 60, reason: 'segunda amarilla', type: 'second_yellow'}
  -- ]
  
  -- SANCIONES RECOMENDADAS
  recommended_sanctions JSONB,
  -- Formato: [
  --   {player_id: 'uuid', matches: 1, reason: 'protesta al árbitro'},
  --   {player_id: 'uuid', matches: 2, reason: 'agresión'},
  --   {player_id: 'uuid', matches: 'expulsion', reason: 'expulsión por disciplina'}
  -- ]
  
  -- OBSERVACIONES
  observations TEXT,                    -- Observaciones generales
  incidents TEXT,                       -- Incidentes importantes
  
  -- VALIDACIÓN
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending': Pendiente por revisar
    -- 'approved': Aprobado por creador
    -- 'rejected': Rechazado
  
  submitted_at TIMESTAMP DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Ejemplo de Inserción de Reporte Arbitral:**
```sql
INSERT INTO referee_reports (
  match_id, referee_id, tournament_id,
  home_score, away_score, decided_by_penalties,
  home_penalties, away_penalties,
  goals, assists, yellow_cards, red_cards,
  recommended_sanctions
) VALUES (
  'match-uuid',
  'referee-uuid',
  'tournament-uuid',
  3, 2, true,
  4, 2,
  -- Goles
  '[
    {player_id: "player1-uuid", team_id: "team1-uuid", minute: 15, type: "normal"},
    {player_id: "player2-uuid", team_id: "team1-uuid", minute: 45, type: "penalty"},
    {player_id: "player3-uuid", team_id: "team1-uuid", minute: 70, type: "normal"},
    {player_id: "player4-uuid", team_id: "team2-uuid", minute: 20, type: "normal"},
    {player_id: "player5-uuid", team_id: "team2-uuid", minute: 60, type: "normal"}
  ]'::jsonb,
  -- Asistencias
  '[
    {player_id: "player6-uuid", team_id: "team1-uuid", minute: 14}
  ]'::jsonb,
  -- Tarjetas amarillas
  '[
    {player_id: "player7-uuid", team_id: "team2-uuid", minute: 30, reason: "simulación"}
  ]'::jsonb,
  -- Tarjetas rojas
  '[]'::jsonb,
  -- Sanciones
  '[]'::jsonb
);
```

### 9️⃣ `tournament_player_stats` - Estadísticas de Jugadores

```sql
CREATE TABLE tournament_player_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id UUID REFERENCES carfutpro(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id),
  
  -- GOLES Y ASISTENCIAS
  goals INT DEFAULT 0,                  -- Goles marcados
  assists INT DEFAULT 0,                -- Asistencias
  penalties_scored INT DEFAULT 0,       -- Penaltis convertidos
  penalties_missed INT DEFAULT 0,       -- Penaltis fallidos
  
  -- DISCIPLINA
  yellow_cards INT DEFAULT 0,
  red_cards INT DEFAULT 0,
  
  -- SANCIONES
  suspended_matches INT DEFAULT 0,      -- Partidos de suspensión pendientes
  is_suspended BOOLEAN DEFAULT false,
  suspension_reason TEXT,
  suspension_end_date TIMESTAMP,
  expelled_from_tournament BOOLEAN DEFAULT false,  -- Expulsión completa
  
  -- PARTICIPACIÓN
  matches_played INT DEFAULT 0,
  minutes_played INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tournament_id, player_id)
);
```

---

## 🔔 Tabla de Sanciones

### 🔟 `player_sanctions` - Registro Formal de Sanciones

```sql
CREATE TABLE player_sanctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES carfutpro(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  
  -- TIPO DE SANCIÓN
  sanction_type VARCHAR(50),
    -- '1_match': Suspensión 1 fecha
    -- '2_matches': Suspensión 2 fechas
    -- '3_matches': Suspensión 3 fechas
    -- '4_matches': Suspensión 4 fechas
    -- 'expulsion': Expulsión del torneo
  
  match_date TIMESTAMP,                 -- Fecha del partido donde se aplicó
  reason TEXT,                          -- Motivo de la sanción
  applied_by_referee_id UUID REFERENCES auth.users(id),
  
  -- VALIDACIÓN
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending': Pendiente de aprobar
    -- 'approved': Aprobada
    -- 'rejected': Rechazada
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔔 Tabla de Notificaciones

### 1️⃣1️⃣ `tournament_notifications` - Notificaciones en Tiempo Real

```sql
CREATE TABLE tournament_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  notification_type VARCHAR(50),
    -- 'invitation': Invitación al torneo
    -- 'registration_confirmed': Inscripción aceptada
    -- 'match_scheduled': Partido programado
    -- 'referee_assigned': Árbitro asignado
    -- 'result_updated': Resultado actualizado
    -- 'suspension': Jugador sancionado
    -- 'bracket_generated': Llaves generadas automáticamente
    -- 'general_update': Cambio general en el torneo
  
  title VARCHAR(255),                   -- Título de la notificación
  message TEXT,                         -- Contenido
  metadata JSONB,                       -- Datos adicionales
  
  read_at TIMESTAMP,                    -- Cuándo se leyó
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Ejemplos de Notificaciones:**
```sql
-- 1. Cuando se actualiza un resultado
INSERT INTO tournament_notifications
VALUES (
  uuid_generate_v4(),
  'tournament-uuid',
  'team-captain-uuid',
  'result_updated',
  'Resultado actualizado: Equipo A 3-2 Equipo B',
  'Tu equipo ganó contra Equipo B. ¡Suma 3 puntos!',
  '{match_id: "...", goals_for: 3, goals_against: 2, points: 3}'::jsonb
);

-- 2. Cuando un jugador es sancionado
INSERT INTO tournament_notifications
VALUES (
  uuid_generate_v4(),
  'tournament-uuid',
  'player-uuid',
  'suspension',
  'Has recibido una sanción',
  'Sanción de 2 fechas por tarjeta roja',
  '{matches_suspended: 2, reason: "tarjeta roja"}'::jsonb
);
```

### 1️⃣2️⃣ `tournament_referees` - Datos de Árbitros

```sql
CREATE TABLE tournament_referees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  carfutpro_id UUID REFERENCES carfutpro(id),
  
  -- CERTIFICACIÓN
  license_number VARCHAR(50),           -- Número de licencia
  certification_level VARCHAR(50),      -- 'regional', 'nacional', 'internacional'
  experience_years INT,                 -- Años de experiencia
  
  -- DISPONIBILIDAD
  available BOOLEAN DEFAULT true,
  availability_schedule JSONB,          -- [{day: 'lunes', hours: ['18:00', '20:00']}, ...]
  
  -- HISTORIAL
  matches_refereed INT DEFAULT 0,
  avg_rating DECIMAL(3, 2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);
```

---

## ⚙️ Funciones PL/pgSQL

### Función 1: Actualizar tabla de posiciones después de reporte

```sql
CREATE OR REPLACE FUNCTION update_group_standings_from_report()
RETURNS TRIGGER AS $$
DECLARE
  v_match RECORD;
  v_home_points INT := 0;
  v_away_points INT := 0;
BEGIN
  -- Obtener datos del partido
  SELECT * INTO v_match FROM tournament_matches WHERE id = NEW.match_id;
  
  -- Calcular puntos según el RESULTADO
  IF NEW.home_score > NEW.away_score THEN
    v_home_points := 3;  -- Victoria: 3 puntos
    v_away_points := 0;  -- Derrota: 0 puntos
  ELSIF NEW.home_score < NEW.away_score THEN
    v_home_points := 0;
    v_away_points := 3;
  ELSE
    -- EMPATE - Depende del sistema de puntuación
    IF NEW.decided_by_penalties THEN
      -- Sistema 0-empate: 1 punto cada uno + 1 al ganador de penaltis
      v_home_points := 1;
      v_away_points := 1;
      IF NEW.home_penalties > NEW.away_penalties THEN
        v_home_points := v_home_points + 1;  -- Total: 2 puntos
      ELSE
        v_away_points := v_away_points + 1;  -- Total: 2 puntos
      END IF;
    ELSE
      -- Empate normal: 1 punto cada uno
      v_home_points := 1;
      v_away_points := 1;
    END IF;
  END IF;
  
  -- ACTUALIZAR ESTADÍSTICAS DEL EQUIPO LOCAL
  UPDATE tournament_group_teams
  SET 
    matches_played = matches_played + 1,
    wins = wins + CASE WHEN v_home_points = 3 THEN 1 ELSE 0 END,
    draws = draws + CASE WHEN NEW.home_score = NEW.away_score THEN 1 ELSE 0 END,
    losses = losses + CASE WHEN v_home_points = 0 AND NEW.home_score != NEW.away_score THEN 1 ELSE 0 END,
    goals_for = goals_for + NEW.home_score,
    goals_against = goals_against + NEW.away_score,
    points = points + v_home_points,
    updated_at = NOW()
  WHERE group_id = v_match.group_id AND team_id = v_match.home_team_id;
  
  -- ACTUALIZAR ESTADÍSTICAS DEL EQUIPO VISITANTE
  UPDATE tournament_group_teams
  SET 
    matches_played = matches_played + 1,
    wins = wins + CASE WHEN v_away_points = 3 THEN 1 ELSE 0 END,
    draws = draws + CASE WHEN NEW.home_score = NEW.away_score THEN 1 ELSE 0 END,
    losses = losses + CASE WHEN v_away_points = 0 AND NEW.home_score != NEW.away_score THEN 1 ELSE 0 END,
    goals_for = goals_for + NEW.away_score,
    goals_against = goals_against + NEW.home_score,
    points = points + v_away_points,
    updated_at = NOW()
  WHERE group_id = v_match.group_id AND team_id = v_match.away_team_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: Se ejecuta automáticamente al insertar un reporte
CREATE TRIGGER trigger_update_standings
AFTER INSERT ON referee_reports
FOR EACH ROW
EXECUTE FUNCTION update_group_standings_from_report();
```

### Función 2: Actualizar estadísticas de jugadores

```sql
CREATE OR REPLACE FUNCTION update_player_stats_from_report()
RETURNS TRIGGER AS $$
DECLARE
  goal JSONB;
  assist JSONB;
BEGIN
  -- PROCESAR GOLES
  IF NEW.goals IS NOT NULL THEN
    FOR goal IN SELECT * FROM jsonb_array_elements(NEW.goals)
    LOOP
      INSERT INTO tournament_player_stats (
        tournament_id, player_id, team_id, goals, penalties_scored
      ) VALUES (
        NEW.tournament_id,
        (goal->>'player_id')::UUID,
        (goal->>'team_id')::UUID,
        1,
        CASE WHEN goal->>'type' = 'penalty' THEN 1 ELSE 0 END
      )
      ON CONFLICT (tournament_id, player_id) 
      DO UPDATE SET 
        goals = tournament_player_stats.goals + 1,
        penalties_scored = tournament_player_stats.penalties_scored + 
          CASE WHEN goal->>'type' = 'penalty' THEN 1 ELSE 0 END;
    END LOOP;
  END IF;
  
  -- PROCESAR ASISTENCIAS
  IF NEW.assists IS NOT NULL THEN
    FOR assist IN SELECT * FROM jsonb_array_elements(NEW.assists)
    LOOP
      UPDATE tournament_player_stats
      SET assists = assists + 1
      WHERE tournament_id = NEW.tournament_id 
        AND player_id = (assist->>'player_id')::UUID;
    END LOOP;
  END IF;
  
  -- PROCESAR TARJETAS ROJAS (=Suspensión)
  IF NEW.red_cards IS NOT NULL THEN
    UPDATE tournament_player_stats
    SET 
      suspended_matches = suspended_matches + 1,
      is_suspended = true
    WHERE tournament_id = NEW.tournament_id 
      AND player_id = ANY(
        SELECT (card->>'player_id')::UUID 
        FROM jsonb_array_elements(NEW.red_cards) AS card
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_player_stats
AFTER INSERT ON referee_reports
FOR EACH ROW
EXECUTE FUNCTION update_player_stats_from_report();
```

### Función 3: Notificar cambios en el torneo

```sql
CREATE OR REPLACE FUNCTION notify_tournament_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificar a todos los equipos registrados
  INSERT INTO tournament_notifications (
    tournament_id, recipient_id, notification_type, title, message
  )
  SELECT 
    NEW.id,
    t.captain_id,
    'general_update',
    'Cambios en ' || NEW.name,
    'El torneo ha sido actualizado. Revisa los detalles.'
  FROM tournament_registrations tr
  JOIN teams t ON t.id = tr.team_id
  WHERE tr.tournament_id = NEW.id AND tr.status IN ('accepted', 'paid');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_tournament_changes
AFTER UPDATE ON tournaments
FOR EACH ROW
EXECUTE FUNCTION notify_tournament_update();
```

---

## 💡 Ejemplos de Uso Práctico

### Ejemplo 1: Crear Torneo con Grupos Automáticos

```javascript
// Frontend: src/pages/CrearTorneoAvanzado.jsx

async function crearTorneoConGrupos() {
  // 1. Crear torneo
  const { data: tournament, error: tourneyError } = await supabase
    .from('tournaments')
    .insert({
      creator_id: user.id,
      name: 'Copa Master 2026',
      max_teams: 16,
      tournament_start: new Date('2026-02-01'),
      status: 'registration_open'
    })
    .select()
    .single();
  
  // 2. Esperar a que 16 equipos se registren (o cerramos inscripción)
  // ...
  
  // 3. Generar grupos automáticamente
  const equipos = await supabase
    .from('tournament_registrations')
    .select('*')
    .eq('tournament_id', tournament.id)
    .eq('status', 'paid');
  
  // 4. Dividir en 4 grupos de 4 equipos (o según cantidad)
  const groups = []
  const groupNames = ['A', 'B', 'C', 'D']
  
  for (let i = 0; i < groupNames.length; i++) {
    const group = await supabase
      .from('tournament_groups')
      .insert({
        tournament_id: tournament.id,
        group_name: groupNames[i],
        group_order: i + 1
      })
      .select()
      .single();
    
    groups.push(group);
  }
  
  // 5. Asignar equipos a grupos (distribuir de forma balanceada)
  equipos.data.forEach((reg, idx) => {
    const groupIndex = idx % 4;
    const group = groups[groupIndex];
    
    supabase
      .from('tournament_group_teams')
      .insert({
        group_id: group.id,
        team_id: reg.team_id,
        registration_id: reg.id
      })
      .then(res => {
        // Notificar
        crearNotificacion(
          reg.captain_id,
          `Tu equipo quedó en el Grupo ${groupNames[groupIndex]}`
        );
      });
  });
}
```

### Ejemplo 2: Árbitro Sube Reporte con Goles y Tarjetas

```javascript
async function subirReportArbitral() {
  const reporte = {
    match_id: matchId,
    referee_id: user.id,
    tournament_id: tournamentId,
    home_score: 3,
    away_score: 2,
    decided_by_penalties: true,
    home_penalties: 4,
    away_penalties: 2,
    
    // Goles como JSON
    goals: [
      { player_id: uuid1, team_id: homeTeamId, minute: 15, type: 'normal' },
      { player_id: uuid2, team_id: homeTeamId, minute: 45, type: 'penalty' },
      { player_id: uuid3, team_id: homeTeamId, minute: 70, type: 'normal' },
      { player_id: uuid4, team_id: awayTeamId, minute: 20, type: 'normal' },
      { player_id: uuid5, team_id: awayTeamId, minute: 60, type: 'normal' }
    ],
    
    // Tarjetas
    yellow_cards: [
      { player_id: uuid6, team_id: awayTeamId, minute: 30, reason: 'simulación' }
    ],
    
    red_cards: [
      { player_id: uuid7, team_id: homeTeamId, minute: 85, reason: 'agresión', type: 'direct' }
    ]
  };
  
  const { error } = await supabase
    .from('referee_reports')
    .insert(reporte);
  
  // Automáticamente:
  // 1. Se actualiza tournament_matches (home_score, away_score, status='finished')
  // 2. Se actualiza tournament_group_teams (puntos, tarjetas)
  // 3. Se actualiza tournament_player_stats (goles, tarjetas, suspensiones)
  // 4. Se notifica a los capitanes
}
```

### Ejemplo 3: Aplicar Sanción a un Jugador

```javascript
async function aplicarSancion(playerId, matches) {
  // Sanción: 1, 2, 3, 4 fechas o 'expulsion'
  
  await supabase
    .from('player_sanctions')
    .insert({
      player_id: playerId,
      tournament_id: tournamentId,
      sanction_type: `${matches}_match`,
      reason: 'Comportamiento antideportivo',
      applied_by_referee_id: refereeId
    });
  
  // Actualizar stats
  await supabase
    .from('tournament_player_stats')
    .update({
      suspended_matches: matches,
      is_suspended: true,
      suspension_reason: 'Sanción disciplinaria'
    })
    .eq('tournament_id', tournamentId)
    .eq('player_id', playerId);
  
  // Notificar
  const notification = await crearNotificacion(
    playerId,
    'Has recibido una sanción',
    `Te han suspendido por ${matches} fecha(s)`
  );
}
```

---

## 🔐 Row Level Security (RLS) Políticas

```sql
-- Solo el creador puede editar el torneo
CREATE POLICY tournaments_creator_all ON tournaments
  FOR ALL USING (creator_id = auth.uid());

-- Todos pueden ver torneos publicados
CREATE POLICY tournaments_public_read ON tournaments
  FOR SELECT USING (status != 'draft' OR creator_id = auth.uid());

-- Árbitros pueden ver y modificar solo sus partidos
CREATE POLICY matches_referee_access ON tournament_matches
  FOR ALL USING (
    referee_id = auth.uid() OR
    EXISTS (SELECT 1 FROM tournaments WHERE id = tournament_id AND creator_id = auth.uid())
  );

-- Cada usuario ve solo sus notificaciones
CREATE POLICY notifications_own ON tournament_notifications
  FOR SELECT USING (recipient_id = auth.uid());
```

---

## 📝 Resumen de Flujo Completo

1. **Creador crea torneo** → `tournaments` (status='draft')
2. **Publica torneo** → status='registration_open'
3. **Equipos se inscriben** → `tournament_registrations` (status='pending')
4. **Creador acepta equipos** → status='paid'
5. **Se generan grupos** → `tournament_groups` + `tournament_group_teams`
6. **Se programan partidos** → `tournament_matches` (status='scheduled')
7. **Creador asigna árbitros** → referee_id en matches
8. **Árbitro sube reporte** → `referee_reports` ✅ **AUTOMÁTICAMENTE:**
   - Actualiza `tournament_group_teams` (puntos, goles)
   - Actualiza `tournament_player_stats` (goles, tarjetas)
   - Notifica a capitanes
9. **Si completó fase de grupos** → Generar `tournament_brackets` (eliminatorias)
10. **Continúa hasta final** → Torneo finalizado

