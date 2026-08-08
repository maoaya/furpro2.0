# 🛡️ SISTEMA COMPLETO DE EQUIPOS CON ESCUDOS Y TEAM CARDS

## 📋 ÍNDICE
1. [Resumen de Funcionalidades](#resumen)
2. [Crear Equipo con Escudo](#crear-equipo)
3. [Team Card (Card del Equipo)](#team-card)
4. [Seleccionar Alineación por Torneo](#seleccionar-alineacion)
5. [Cálculo del OVR del Equipo](#calculo-ovr)
6. [Configuración de Base de Datos](#configuracion-bd)
7. [Integración en tu Proyecto](#integracion)

---

## 🎯 RESUMEN DE FUNCIONALIDADES <a name="resumen"></a>

### ✅ Implementado:

1. **Sistema de Upload de Escudo en CrearEquipo.jsx**
   - Paso 3 del wizard permite subir escudo personalizado
   - Drag & drop o click para seleccionar
   - Preview en tiempo real
   - Validación: máximo 5MB, solo imágenes
   - Guarda en Supabase Storage bucket `media/team-logos/`

2. **Componente TeamCard.jsx**
   - Card visual estilo FIFA pero para equipos
   - Muestra: OVR, escudo, nombre, stats (ATT/MID/DEF)
   - Torneos ganados, racha actual
   - 3 tamaños: small (140x200), normal (180x260), large (240x340)
   - Colores dinámicos según OVR

3. **Servicio TeamStatsService.js**
   - Calcula OVR del equipo automáticamente:
     * Promedio de cards de jugadores
     * +2 por cada torneo ganado
     * +10% del win rate
     * +0.5 por partido en racha ganadora
   - Calcula stats por posición (ATT/MID/DEF)
   - Actualiza stats después de cada partido

4. **Componente SeleccionarAlineacion.jsx**
   - Modal para seleccionar jugadores por torneo
   - Soporta todos los formatos: 5v5, 7v7, 8v8, 9v9, 11v11
   - Selector de formación: 4-4-2, 4-3-3, etc.
   - Validación de mínimo de jugadores según formato
   - Asignación de capitán
   - Guarda en tabla `team_lineups`

5. **SQL Schema Completo**
   - `team_members`: Miembros con roles y posiciones
   - `team_lineups`: Alineaciones específicas por torneo
   - `tournament_teams`: Equipos inscritos en torneos
   - `team_invitations`: Sistema de invitaciones
   - Trigger automático que agrega al creador como captain

---

## 🏗️ CREAR EQUIPO CON ESCUDO <a name="crear-equipo"></a>

### Flujo del Usuario:

**Paso 1: Información Básica**
- Nombre del equipo (máx 50 caracteres)
- Categoría: Masculina, Femenina, Mixta, Infantil, Todos

**Paso 2: Detalles**
- Ubicación
- Máximo de jugadores (7/11/15/22)
- Nivel requerido (Principiante, Intermedio, Avanzado, Profesional)

**Paso 3: Escudo del Equipo** ⭐ NUEVO
- Zona de drag & drop para subir imagen
- Preview en tiempo real
- Validaciones:
  * Solo imágenes (PNG, JPG, SVG)
  * Máximo 5MB
  * Recomendado: 500x500px
- Botón para eliminar y cambiar
- **Opcional**: Puede saltarse y usar escudo por defecto

**Paso 4: Descripción y Confirmación**
- Descripción opcional (500 caracteres)
- Resumen de todo lo ingresado
- Botón "Crear Equipo"

### Resultado:
```javascript
// Equipo creado en Supabase:
{
  id: 'uuid',
  name: 'Nombre del equipo',
  logo_url: 'https://supabase.co/.../team-logos/email-timestamp.png',
  category: 'masculina',
  location: 'Madrid',
  max_players: 11,
  required_level: 'intermedio',
  owner_email: 'usuario@email.com',
  stats: {
    wins: 0,
    losses: 0,
    draws: 0,
    goals_for: 0,
    goals_against: 0,
    tournaments_won: 0,
    current_streak: 0
  }
}

// Automáticamente se crea registro en team_members:
{
  team_id: 'uuid',
  user_email: 'usuario@email.com',
  role: 'captain',
  position: 'CM',
  jersey_number: 10
}
```

---

## 🎴 TEAM CARD (Card del Equipo) <a name="team-card"></a>

### ¿Qué es?
Similar a las FIFA Cards de jugadores, pero para equipos. Muestra el "rating" general del equipo basado en sus jugadores y performance.

### Uso:
```jsx
import TeamCard from '../components/TeamCard';

// Tamaño normal
<TeamCard 
  team={teamData} 
  size="normal"
  showStats={true}
  onClick={() => navigate(`/equipo/${teamId}`)}
/>

// Tamaño grande para destacar
<TeamCard 
  team={teamData} 
  size="large"
  showStats={true}
/>

// Tamaño pequeño para grids
<TeamCard 
  team={teamData} 
  size="small"
  showStats={false}
/>
```

### Datos del Team:
```javascript
const teamData = {
  name: 'Nombre del Equipo',
  category: 'masculina',
  logo_url: 'https://...',
  stats: {
    // OVR se calcula automáticamente
    avg_player_ovr: 75,
    tournaments_won: 3,
    win_rate: 65,
    current_streak: 5,  // +5 = racha ganadora, -2 = racha perdedora
    
    // Stats por posición
    attack: 78,
    midfield: 75,
    defense: 72
  }
};
```

### Colores del OVR:
- 90-99: **Teal** (#1CE1AC) - Top tier
- 85-89: **Gold** (#FFD700) - Elite
- 80-84: **Silver** (#C0C0C0) - Bueno
- 75-79: **Bronze** (#CD7F32) - Promedio
- <75: **Common** (#B0B0B0) - Básico

### Características:
- ✅ Muestra OVR calculado en grande
- ✅ Escudo del equipo en centro
- ✅ Nombre con gradient gold
- ✅ Stats ATT/MID/DEF con colores
- ✅ Indicador de racha (🔥 o ❄️)
- ✅ Badge de torneos ganados (🏆)
- ✅ Hover effect con animación
- ✅ Responsive (3 tamaños)

---

## ⚽ SELECCIONAR ALINEACIÓN POR TORNEO <a name="seleccionar-alineacion"></a>

### ¿Por qué?
Cada torneo puede tener:
- Diferente formato (5v5, 7v7, 11v11)
- Diferentes jugadores disponibles
- Estrategias específicas

### Flujo:

1. **Inscribir equipo a torneo**
   ```javascript
   await supabase
     .from('tournament_teams')
     .insert({
       tournament_id: tournamentId,
       team_id: teamId,
       status: 'confirmed'
     });
   ```

2. **Abrir modal de selección**
   ```jsx
   <SeleccionarAlineacion
     teamId={teamId}
     tournamentId={tournamentId}
     tournamentFormat="11v11"  // Detectado del torneo
     onClose={() => setShowModal(false)}
     onSave={(lineup) => console.log('Alineación guardada:', lineup)}
   />
   ```

3. **Usuario selecciona:**
   - Formación (4-4-2, 4-3-3, etc.)
   - Jugadores titulares (según formato)
   - Capitán del equipo
   - Hasta 5 suplentes

4. **Guardar alineación**
   ```javascript
   // Se guarda en team_lineups
   {
     team_id: 'uuid',
     tournament_id: 'uuid',
     formation: '4-4-2',
     selected_players: [
       'jugador1@email.com',
       'jugador2@email.com',
       // ... hasta mínimo requerido
     ],
     captain_email: 'capitan@email.com',
     substitutes: ['sub1@email.com', 'sub2@email.com']
   }
   ```

### Validaciones:
- ✅ Mínimo de jugadores según formato:
  * 5v5 → 5 jugadores
  * 7v7 → 7 jugadores
  * 11v11 → 11 jugadores
- ✅ Máximo: mínimo + 5 suplentes
- ✅ Capitán obligatorio
- ✅ Formaciones apropiadas por formato

---

## 🧮 CÁLCULO DEL OVR DEL EQUIPO <a name="calculo-ovr"></a>

### Fórmula:
```
OVR_Equipo = Promedio_Jugadores + Bonus_Torneos + Bonus_WinRate + Bonus_Racha
```

### Desglose:

#### 1. Promedio de Jugadores (Base)
```javascript
// Toma la mejor card de cada jugador del equipo
const avgPlayerOVR = totalPlayerOVR / playerCount;
// Ejemplo: (75 + 80 + 72 + 78) / 4 = 76.25 → 76
```

#### 2. Bonus por Torneos Ganados
```javascript
const tournamentBonus = tournaments_won * 2;
// Ejemplo: 3 torneos ganados = +6 OVR
```

#### 3. Bonus por Win Rate
```javascript
const winRate = wins / (wins + losses + draws);
const winRateBonus = Math.floor(winRate * 10);
// Ejemplo: 65% win rate = +6 OVR
```

#### 4. Bonus por Racha Actual
```javascript
const streakBonus = current_streak > 0 
  ? Math.floor(current_streak * 0.5) 
  : 0;
// Ejemplo: 5 victorias seguidas = +2 OVR
```

### Ejemplo Completo:
```javascript
// Equipo con:
// - Promedio jugadores: 76
// - 3 torneos ganados
// - 65% win rate (13 victorias de 20 partidos)
// - Racha de 5 victorias

OVR = 76 + (3*2) + 6 + 2 = 90 (ELITE!)
```

### Uso:
```javascript
import TeamStatsService from '../services/TeamStatsService';

// Obtener stats completas
const stats = await TeamStatsService.getCompleteTeamStats(teamId);
console.log(stats);
// {
//   ovr: 90,
//   breakdown: {
//     base: 76,
//     tournamentBonus: 6,
//     winRateBonus: 6,
//     streakBonus: 2
//   },
//   attack: 78,
//   midfield: 75,
//   defense: 72,
//   tournaments_won: 3,
//   win_rate: 65,
//   current_streak: 5
// }
```

---

## 🗄️ CONFIGURACIÓN DE BASE DE DATOS <a name="configuracion-bd"></a>

### 1. Ejecutar SQL
Ir a Supabase SQL Editor y ejecutar:
```bash
sql/create_team_system.sql
```

Este script crea:
- ✅ Tabla `team_members`
- ✅ Tabla `team_lineups`
- ✅ Tabla `tournament_teams`
- ✅ Tabla `team_invitations`
- ✅ Trigger auto-agregar captain
- ✅ Funciones auxiliares
- ✅ Políticas de seguridad (RLS)

### 2. Crear Bucket de Storage
En Supabase Storage:
```javascript
// Ya debería existir el bucket 'media'
// Verificar que tiene carpeta team-logos/
// Políticas:
// - Public access para lectura
// - Authenticated users para upload
```

### 3. Verificar Tablas Existentes
```sql
-- Verificar que teams tiene las columnas necesarias
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'teams';

-- Debería incluir:
-- - logo_url (TEXT)
-- - stats (JSONB)
```

---

## 🔧 INTEGRACIÓN EN TU PROYECTO <a name="integracion"></a>

### Paso 1: Importar Componentes
```jsx
// En cualquier página
import TeamCard from '../components/TeamCard';
import SeleccionarAlineacion from '../components/SeleccionarAlineacion';
import TeamStatsService from '../services/TeamStatsService';
```

### Paso 2: Cargar Datos del Equipo
```javascript
const [team, setTeam] = useState(null);

useEffect(() => {
  const loadTeam = async () => {
    // 1. Cargar equipo de Supabase
    const { data: teamData } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    // 2. Calcular stats
    const stats = await TeamStatsService.getCompleteTeamStats(teamId);
    
    // 3. Combinar
    setTeam({ ...teamData, stats });
  };
  
  loadTeam();
}, [teamId]);
```

### Paso 3: Mostrar Team Card
```jsx
{team && (
  <TeamCard 
    team={team}
    size="normal"
    showStats={true}
    onClick={() => navigate(`/equipo/${teamId}`)}
  />
)}
```

### Paso 4: Inscripción a Torneo con Alineación
```jsx
const [showLineupModal, setShowLineupModal] = useState(false);
const [selectedTournament, setSelectedTournament] = useState(null);

const handleEnroll = async (tournament) => {
  // 1. Inscribir
  await supabase
    .from('tournament_teams')
    .insert({
      tournament_id: tournament.id,
      team_id: teamId
    });
  
  // 2. Abrir modal de alineación
  setSelectedTournament(tournament);
  setShowLineupModal(true);
};

// En el render:
{showLineupModal && (
  <SeleccionarAlineacion
    teamId={teamId}
    tournamentId={selectedTournament.id}
    tournamentFormat={selectedTournament.format}
    onClose={() => setShowLineupModal(false)}
    onSave={(lineup) => {
      console.log('Alineación guardada:', lineup);
      setShowLineupModal(false);
    }}
  />
)}
```

### Paso 5: Actualizar Stats Después de Partido
```javascript
import TeamStatsService from '../services/TeamStatsService';

// Al finalizar un partido
const updateAfterMatch = async (teamId, result, goalsFor, goalsAgainst) => {
  // result: 'win' | 'loss' | 'draw'
  await TeamStatsService.updateTeamStatsAfterMatch(
    teamId,
    result,
    goalsFor,
    goalsAgainst
  );
  
  // Si ganó torneo
  if (wonTournament) {
    await TeamStatsService.incrementTournamentsWon(teamId);
  }
};
```

---

## 📱 EJEMPLO DE PÁGINA COMPLETA

Ver: `src/pages/EquipoTorneosPage.jsx`

Esta página de ejemplo muestra:
- ✅ Team Card grande
- ✅ Desglose de OVR
- ✅ Lista de torneos inscritos
- ✅ Lista de torneos disponibles
- ✅ Botón para inscribirse
- ✅ Modal de alineación
- ✅ Integración completa

---

## 🎨 PERSONALIZACIÓN

### Cambiar Colores del Team Card:
```jsx
// En TeamCard.jsx línea 35-42
const getOVRColor = (rating) => {
  if (rating >= 90) return '#TU_COLOR_TOP';
  if (rating >= 85) return '#TU_COLOR_ELITE';
  // etc...
};
```

### Cambiar Formaciones Disponibles:
```jsx
// En SeleccionarAlineacion.jsx línea 21-25
const formations = {
  '11v11': ['4-4-2', '4-3-3', 'TU_FORMACION'],
  '7v7': ['3-2-1', 'TU_FORMACION_7v7'],
  // etc...
};
```

### Ajustar Cálculo de OVR:
```javascript
// En TeamStatsService.js línea 58-62
const tournamentBonus = tournamentsWon * 3; // Cambiar multiplicador
const winRateBonus = Math.floor(winRate * 15); // Cambiar peso
const streakBonus = currentStreak > 0 
  ? Math.floor(currentStreak * 1) // Cambiar valor por partido
  : 0;
```

---

## 🐛 TROUBLESHOOTING

### El escudo no se sube
1. Verificar que existe el bucket `media` en Supabase Storage
2. Verificar políticas de upload (authenticated users)
3. Verificar tamaño del archivo (<5MB)

### OVR del equipo es 70 (default)
1. Verificar que los jugadores tienen cards en tabla `users`
2. Verificar que existe `team_members` con jugadores
3. Ejecutar manualmente: `TeamStatsService.calculateTeamOVR(teamId)`

### Modal de alineación no abre
1. Verificar que existe tabla `team_members` con jugadores
2. Verificar formato del torneo (5v5, 7v7, 11v11)
3. Verificar que el equipo tiene suficientes jugadores

### Trigger no agrega captain automáticamente
1. Verificar que el trigger existe en Supabase:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trigger_auto_add_captain';
   ```
2. Si no existe, ejecutar la parte del trigger en el SQL

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Ejecutar SQL (`sql/create_team_system.sql`)
- [x] Verificar bucket `media` en Supabase Storage
- [x] Importar `TeamCard.jsx` en tus páginas
- [x] Importar `SeleccionarAlineacion.jsx` para torneos
- [x] Importar `TeamStatsService.js` para stats
- [x] Actualizar `CrearEquipo.jsx` con paso de escudo
- [x] Crear rutas para gestionar torneos
- [ ] Probar flujo completo:
  - [ ] Crear equipo con escudo
  - [ ] Ver Team Card
  - [ ] Inscribir a torneo
  - [ ] Seleccionar alineación
  - [ ] Jugar partido
  - [ ] Verificar actualización de OVR

---

## 🚀 PRÓXIMAS MEJORAS

1. **Diseñador de escudos integrado**
   - Formas predefinidas
   - Selector de colores
   - Símbolos y badges
   - Texto personalizado

2. **Comparador de equipos**
   - Comparar OVRs
   - Historial de enfrentamientos
   - Predicción de resultado

3. **Marketplace de jugadores**
   - "Fichar" jugadores de otros equipos
   - Ofertas y contratos
   - Transfer window

4. **Rankings globales**
   - Top equipos por OVR
   - Top equipos por región
   - Top equipos por categoría

---

¿Necesitas ayuda con algo específico? ¡Dime! 🚀
