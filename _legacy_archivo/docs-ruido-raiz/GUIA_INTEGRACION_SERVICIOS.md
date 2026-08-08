# 🔌 GUÍA DE INTEGRACIÓN DE SERVICIOS

## 📦 Servicios Disponibles

```javascript
// Importar servicios
import TournamentService from './services/TournamentService';
import PenaltyService from './services/PenaltyService';
import RefereeService from './services/RefereeService';
```

---

## 1️⃣ TOURNAMENT SERVICE (19 funciones)

### Ejemplo 1: Crear y Configurar Torneo
```javascript
// En CrearTorneoAvanzado.jsx
import TournamentService from '../services/TournamentService';

const handleCreateTournament = async (formData) => {
  try {
    // El torneo ya fue creado con INSERT directo
    // Ahora generar grupos automáticamente
    const tournament = await TournamentService.getTournamentById(newTournamentId);
    
    if (tournament.format === 'groups') {
      await TournamentService.generateGroups(newTournamentId, 4); // 4 grupos
      console.log('Grupos A, B, C, D creados');
    }
    
    navigate(`/torneo/${newTournamentId}`);
  } catch (error) {
    alert('Error al configurar torneo: ' + error.message);
  }
};
```

### Ejemplo 2: Inscribir Equipo
```javascript
// En página de detalle de torneo
const handleRegisterTeam = async () => {
  try {
    // Validar que el equipo cumple requisitos
    const tournament = await TournamentService.getTournamentById(tournamentId);
    
    if (tournament.registration_fee > 0) {
      // Mostrar modal de pago
      await processPayment(tournament.registration_fee, tournament.currency);
    }
    
    // Registrar equipo
    const registration = await TournamentService.registerTeamInTournament(
      tournamentId,
      teamId,
      captainId,
      [player1Id, player2Id, player3Id, ...] // roster
    );
    
    alert('¡Equipo inscrito exitosamente!');
    // Recargar datos
    loadTournamentData();
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### Ejemplo 3: Generar Fixture de Grupo
```javascript
// En panel de administrador de torneo
const handleGenerateFixtures = async (groupId) => {
  try {
    const matchDates = [
      '2026-02-01T10:00:00',
      '2026-02-01T12:00:00',
      '2026-02-02T10:00:00',
      // ... más fechas según cantidad de partidos
    ];
    
    const fixtures = await TournamentService.generateGroupFixtures(
      tournamentId,
      groupId,
      matchDates
    );
    
    console.log(`${fixtures.length} partidos generados`);
    alert('Fixture generado correctamente');
  } catch (error) {
    alert('Error al generar fixture: ' + error.message);
  }
};
```

### Ejemplo 4: Ver Tabla de Posiciones
```javascript
// En TorneoStandingsPage.jsx
import { useState, useEffect } from 'react';
import TournamentService from '../services/TournamentService';

function TorneoStandingsPage() {
  const [standings, setStandings] = useState([]);
  const groupId = useParams().groupId;
  
  useEffect(() => {
    loadStandings();
  }, [groupId]);
  
  const loadStandings = async () => {
    try {
      const data = await TournamentService.getGroupStandings(groupId);
      setStandings(data);
    } catch (error) {
      console.error('Error al cargar tabla:', error);
    }
  };
  
  return (
    <div>
      <h2>Tabla de Posiciones</h2>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.id}>
              <td>{index + 1}</td>
              <td>{team.team_name}</td>
              <td>{team.matches_played}</td>
              <td>{team.wins}</td>
              <td>{team.draws}</td>
              <td>{team.losses}</td>
              <td>{team.goals_for}</td>
              <td>{team.goals_against}</td>
              <td>{team.goal_difference}</td>
              <td><strong>{team.points}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Ejemplo 5: Goleadores del Torneo
```javascript
// En componente TopScorers
const [topScorers, setTopScorers] = useState([]);

useEffect(() => {
  loadTopScorers();
}, [tournamentId]);

const loadTopScorers = async () => {
  try {
    const scorers = await TournamentService.getTournamentTopScorers(
      tournamentId,
      10 // Top 10
    );
    setTopScorers(scorers);
  } catch (error) {
    console.error('Error:', error);
  }
};

return (
  <div className="top-scorers">
    <h3>🔥 Goleadores</h3>
    {topScorers.map((scorer, index) => (
      <div key={scorer.player_id} className="scorer-item">
        <span className="position">{index + 1}</span>
        <img src={scorer.avatar_url} alt={scorer.player_name} />
        <span className="name">{scorer.player_name}</span>
        <span className="goals">{scorer.goals} goles</span>
      </div>
    ))}
  </div>
);
```

### Ejemplo 6: Verificar Requisito de Streaming
```javascript
// Antes de iniciar partido
const handleStartMatch = async (matchId) => {
  try {
    const streamingInfo = await TournamentService.checkStreamingRequirement(matchId);
    
    if (streamingInfo.required) {
      // Verificar si hay streams activos
      const activeStreams = await getActiveStreams(matchId);
      
      if (activeStreams.length < streamingInfo.min_streams) {
        alert(`Este torneo requiere al menos ${streamingInfo.min_streams} transmisión(es) en vivo`);
        return;
      }
    }
    
    // Iniciar partido
    await updateMatchStatus(matchId, 'in_progress');
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 2️⃣ PENALTY SERVICE (12 funciones)

### Ejemplo 1: Crear Partida PvP
```javascript
// En PenaltisMultijugador.jsx
import PenaltyService from '../services/PenaltyService';

const handleCreateMatch = async () => {
  try {
    const match = await PenaltyService.createPenaltyMatch(
      currentUserId,
      null, // Sin oponente, esperando
      'pvp',
      'media' // dificultad
    );
    
    setMatchId(match.id);
    setWaitingOpponent(true);
    
    // Suscribirse a cambios
    const unsubscribe = PenaltyService.subscribeToPenaltyMatch(
      match.id,
      (updatedMatch) => {
        if (updatedMatch.player2_id) {
          setWaitingOpponent(false);
          alert('¡Oponente encontrado! Comienza el partido');
        }
        
        if (updatedMatch.status === 'completed') {
          handleMatchEnd(updatedMatch);
        }
      }
    );
    
    // Guardar función para limpiar suscripción
    setUnsubscribeFn(() => unsubscribe);
  } catch (error) {
    alert('Error al crear partida: ' + error.message);
  }
};
```

### Ejemplo 2: Registrar Disparo
```javascript
// Cuando el jugador dispara
const handleShoot = async (direction, power) => {
  try {
    // Verificar turno
    const isMyTurn = await PenaltyService.isPlayerTurn(matchId, currentUserId);
    if (!isMyTurn) {
      alert('No es tu turno');
      return;
    }
    
    // Simular dirección del portero (random o IA)
    const goalieDirection = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
    
    // Determinar si es gol
    const isGoal = direction !== goalieDirection || power > 0.8;
    
    // Registrar en base de datos
    const updatedMatch = await PenaltyService.recordPenaltyShot(
      matchId,
      currentUserId,
      isGoal,
      direction,
      power,
      goalieDirection
    );
    
    // Actualizar UI
    setMatch(updatedMatch);
    
    if (updatedMatch.status === 'completed') {
      showMatchResult(updatedMatch);
    }
  } catch (error) {
    console.error('Error al registrar disparo:', error);
  }
};
```

### Ejemplo 3: Mostrar Ranking
```javascript
// En página de leaderboard de penaltis
import { useState, useEffect } from 'react';
import PenaltyService from '../services/PenaltyService';

function PenaltyLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  
  useEffect(() => {
    loadLeaderboard();
  }, []);
  
  const loadLeaderboard = async () => {
    try {
      const data = await PenaltyService.getPenaltyLeaderboard(100, 5); // Top 100, mín 5 partidas
      setLeaderboard(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="leaderboard">
      <h2>🏆 Ranking de Penaltis</h2>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Jugador</th>
            <th>Partidas</th>
            <th>Victorias</th>
            <th>% Goles</th>
            <th>Racha</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={player.user_id}>
              <td>{index + 1}</td>
              <td>
                <img src={player.carfutpro.avatar_url} alt="" />
                {player.carfutpro.nombre} {player.carfutpro.apellido}
              </td>
              <td>{player.matches_played}</td>
              <td>{player.matches_won}</td>
              <td>{player.goal_percentage}%</td>
              <td>
                {player.win_streak > 0 && `🔥 ${player.win_streak}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Ejemplo 4: Unirse a Partida Existente
```javascript
// Mostrar partidas disponibles
const [availableMatches, setAvailableMatches] = useState([]);

useEffect(() => {
  loadAvailableMatches();
  
  // Actualizar cada 5 segundos
  const interval = setInterval(loadAvailableMatches, 5000);
  return () => clearInterval(interval);
}, []);

const loadAvailableMatches = async () => {
  try {
    const matches = await PenaltyService.getAvailablePenaltyMatches(20);
    setAvailableMatches(matches);
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleJoinMatch = async (matchId) => {
  try {
    const match = await PenaltyService.joinPenaltyMatch(matchId, currentUserId);
    navigate(`/penaltis/${match.id}`);
  } catch (error) {
    alert('Error al unirse: ' + error.message);
  }
};

return (
  <div>
    <h3>Partidas Esperando Oponente</h3>
    {availableMatches.map(match => (
      <div key={match.id} className="match-card">
        <img src={match.player1.avatar_url} alt="" />
        <span>{match.player1.nombre}</span>
        <span>Dificultad: {match.difficulty}</span>
        <button onClick={() => handleJoinMatch(match.id)}>
          Unirse
        </button>
      </div>
    ))}
  </div>
);
```

---

## 3️⃣ REFEREE SERVICE (12 funciones)

### Ejemplo 1: Asignar Árbitro a Partido
```javascript
// En ArbitroPanelPage.jsx o admin panel
import RefereeService from '../services/RefereeService';
import TournamentService from '../services/TournamentService';

const handleAssignReferee = async (matchId, refereeId) => {
  try {
    // 1. Obtener datos del partido
    const matches = await TournamentService.getTournamentMatches(tournamentId);
    const match = matches.find(m => m.id === matchId);
    
    // 2. Verificar disponibilidad del árbitro
    const isAvailable = await RefereeService.checkRefereeAvailability(
      refereeId,
      match.match_date,
      120 // 120 minutos (2 horas)
    );
    
    if (!isAvailable) {
      alert('El árbitro no está disponible en ese horario');
      return;
    }
    
    // 3. Asignar árbitro (crea notificación automática)
    await TournamentService.assignRefereeToMatch(matchId, refereeId);
    
    alert('Árbitro asignado correctamente');
    loadMatches(); // Recargar datos
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### Ejemplo 2: Buscar Árbitros Disponibles
```javascript
// En modal de selección de árbitro
const [availableReferees, setAvailableReferees] = useState([]);

useEffect(() => {
  loadReferees();
}, []);

const loadReferees = async () => {
  try {
    const referees = await RefereeService.getAvailableReferees({
      certificationLevel: 'Nacional', // Opcional
      minExperience: 2, // Mínimo 2 años
      ciudad: tournament.city // Árbitros de la misma ciudad
    });
    
    setAvailableReferees(referees);
  } catch (error) {
    console.error('Error:', error);
  }
};

return (
  <div className="referee-selection">
    <h3>Seleccionar Árbitro</h3>
    {availableReferees.map(referee => (
      <div key={referee.user_id} className="referee-card">
        <img src={referee.carfutpro.avatar_url} alt="" />
        <div>
          <strong>{referee.carfutpro.nombre} {referee.carfutpro.apellido}</strong>
          <div>Certificación: {referee.certification_level}</div>
          <div>Experiencia: {referee.experience_years} años</div>
          <div>Rating: {'⭐'.repeat(Math.round(referee.average_rating))}</div>
          <div>Licencia: {referee.license_number}</div>
        </div>
        <button onClick={() => handleAssignReferee(matchId, referee.user_id)}>
          Asignar
        </button>
      </div>
    ))}
  </div>
);
```

### Ejemplo 3: Crear Reporte Arbitral
```javascript
// En formulario de reporte
const handleSubmitReport = async (formData) => {
  try {
    const reportData = {
      homeScore: parseInt(formData.homeScore),
      awayScore: parseInt(formData.awayScore),
      decidedByPenalties: formData.penalties === 'yes',
      homeWonPenalties: formData.penalties === 'yes' ? formData.homeWonPenalties : null,
      homeYellowCards: parseInt(formData.homeYellowCards) || 0,
      homeRedCards: parseInt(formData.homeRedCards) || 0,
      awayYellowCards: parseInt(formData.awayYellowCards) || 0,
      awayRedCards: parseInt(formData.awayRedCards) || 0,
      incidents: formData.incidents || null,
      notes: formData.notes || null,
      playerStats: [
        {
          player_id: playerId1,
          goals: 2,
          yellow_cards: 1,
          red_cards: 0
        },
        // ... más jugadores
      ]
    };
    
    // Crear reporte (activa trigger que actualiza tabla posiciones)
    const report = await RefereeService.createRefereeReport(
      matchId,
      currentUserId,
      reportData
    );
    
    alert('Reporte enviado. La tabla de posiciones se actualizó automáticamente.');
    navigate('/arbitro/panel');
  } catch (error) {
    alert('Error al enviar reporte: ' + error.message);
  }
};
```

### Ejemplo 4: Ver Estadísticas de Árbitro
```javascript
// En perfil de árbitro
const [stats, setStats] = useState(null);

useEffect(() => {
  loadRefereeStats();
}, [refereeId]);

const loadRefereeStats = async () => {
  try {
    const refereeStats = await RefereeService.getRefereeStats(refereeId);
    setStats(refereeStats);
  } catch (error) {
    console.error('Error:', error);
  }
};

return (
  <div className="referee-profile">
    <h2>Estadísticas del Árbitro</h2>
    {stats && (
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.matches_directed}</div>
          <div className="stat-label">Partidos Dirigidos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.yellow_cards_shown}</div>
          <div className="stat-label">Tarjetas Amarillas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.red_cards_shown}</div>
          <div className="stat-label">Tarjetas Rojas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.average_rating.toFixed(1)} ⭐</div>
          <div className="stat-label">Rating Promedio</div>
          <div className="stat-sublabel">({stats.total_ratings} calificaciones)</div>
        </div>
      </div>
    )}
  </div>
);
```

### Ejemplo 5: Calificar Desempeño de Árbitro
```javascript
// Después de que termina el partido
const handleRateReferee = async (rating, comment) => {
  try {
    await RefereeService.rateReferee(
      refereeId,
      matchId,
      rating, // 1-5 estrellas
      comment // Opcional
    );
    
    alert('Calificación enviada. Gracias por tu feedback.');
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

return (
  <div className="rate-referee">
    <h3>Calificar Árbitro</h3>
    <div className="stars">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => setRating(star)}
          className={star <= rating ? 'active' : ''}
        >
          ⭐
        </button>
      ))}
    </div>
    <textarea
      placeholder="Comentario opcional"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
    <button onClick={() => handleRateReferee(rating, comment)}>
      Enviar Calificación
    </button>
  </div>
);
```

---

## 🎯 PATRONES COMUNES

### 1. Manejo de Errores Consistente
```javascript
const handleAction = async () => {
  try {
    const result = await SomeService.someFunction();
    // Éxito
    alert('Operación exitosa');
    updateUI(result);
  } catch (error) {
    // Error
    console.error('Error detallado:', error);
    alert('Error: ' + error.message);
  }
};
```

### 2. Suscripciones Realtime con Cleanup
```javascript
useEffect(() => {
  const unsubscribe = PenaltyService.subscribeToPenaltyMatch(
    matchId,
    (updatedMatch) => {
      setMatch(updatedMatch);
    }
  );
  
  // Cleanup al desmontar componente
  return () => {
    unsubscribe();
  };
}, [matchId]);
```

### 3. Carga de Datos con Loading State
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    const result = await TournamentService.getAvailableTournaments();
    setData(result);
    setError(null);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

if (loading) return <div>Cargando...</div>;
if (error) return <div>Error: {error}</div>;
return <div>{/* Renderizar data */}</div>;
```

### 4. Validación Antes de Operaciones Críticas
```javascript
const handleDelete = async (itemId) => {
  // Confirmación
  if (!confirm('¿Estás seguro?')) return;
  
  // Validación
  if (!userHasPermission) {
    alert('No tienes permisos');
    return;
  }
  
  // Operación
  try {
    await deleteItem(itemId);
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

---

## ✅ CHECKLIST DE INTEGRACIÓN

### Para Cada Componente:
- [ ] Importar servicios necesarios
- [ ] Reemplazar llamadas directas a Supabase
- [ ] Implementar manejo de errores
- [ ] Agregar loading states
- [ ] Cleanup de suscripciones Realtime
- [ ] Validar permisos antes de operaciones
- [ ] Testing manual del flujo completo

### Componentes a Actualizar:
- [ ] CrearTorneoAvanzado.jsx → TournamentService
- [ ] ArbitroPanelPage.jsx → RefereeService + TournamentService
- [ ] TorneoStandingsPage.jsx → TournamentService
- [ ] TorneoBracketPage.jsx → TournamentService
- [ ] NotificacionesTorneoPage.jsx → TournamentService
- [ ] PenaltisMultijugador.jsx → PenaltyService
- [ ] ChatInstagramNew.jsx → Considerar migrar a Supabase Realtime

---

**Fecha:** 12 Enero 2026  
**Versión:** 2.0  
**Autor:** FutPro Development Team
