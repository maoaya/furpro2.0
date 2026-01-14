import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import { UserService } from '../services/UserService';
import './MiEquipoMejorado.css';

/**
 * MiEquipoMejorado - Visualización profesional de plantilla de equipo
 * 
 * Features:
 * - Vista de formación 4-3-3, 4-2-3-1, etc.
 * - Tarjetas de jugadores con estadísticas
 * - Filtros por posición
 * - Editor de formación (solo propietario)
 * - Estadísticas del equipo
 * - Comparativa vs otros equipos
 */
export default function MiEquipoMejorado() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  
  // Estado del equipo
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState('formacion'); // formacion, jugadores, estadisticas
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Datos agregados
  const [teamStats, setTeamStats] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  
  // Formaciones disponibles
  const formations = {
    '4-3-3': { defenders: 4, midfielders: 3, forwards: 3 },
    '4-2-3-1': { defenders: 4, midfielders: 5, forwards: 1 },
    '3-5-2': { defenders: 3, midfielders: 5, forwards: 2 },
    '5-3-2': { defenders: 5, midfielders: 3, forwards: 2 },
    '4-4-2': { defenders: 4, midfielders: 4, forwards: 2 },
  };
  
  // Posiciones
  const positions = {
    'GK': { name: 'Portero', color: '#1e3a8a' },
    'DEF': { name: 'Defensa', color: '#334155' },
    'MID': { name: 'Centrocampista', color: '#7c3aed' },
    'FWD': { name: 'Delantero', color: '#dc2626' },
  };

  // Cargar datos del equipo
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        
        // Obtener equipo
        const { data: teamData, error: teamError } = await supabase
          .from('equipos')
          .select('*')
          .eq('id', teamId)
          .single();
        
        if (teamError) throw teamError;
        setTeam(teamData);
        
        // Verificar si es propietario
        const userData = await UserService.getUserProfile();
        setIsOwner(userData?.id === teamData.manager_id);
        
        // Obtener jugadores
        const { data: playersData, error: playersError } = await supabase
          .from('jugadores_equipos')
          .select(`
            *,
            usuario:usuarios(
              id,
              nombre,
              apellido,
              avatar_url,
              posicion
            )
          `)
          .eq('equipo_id', teamId)
          .order('posicion', { ascending: true });
        
        if (playersError) throw playersError;
        setPlayers(playersData || []);
        
        // Calcular estadísticas
        calculateTeamStats(playersData || []);
        
      } catch (err) {
        console.error('Error fetching team:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamData();
  }, [teamId]);

  // Calcular estadísticas del equipo
  const calculateTeamStats = (playersList) => {
    const stats = {
      totalPlayers: playersList.length,
      averageAge: 0,
      totalMatches: 0,
      totalGoals: 0,
      byPosition: {},
    };
    
    let totalAge = 0;
    let validPlayers = 0;
    
    playersList.forEach(player => {
      // Edad promedio
      if (player.usuario?.fecha_nacimiento) {
        const birthDate = new Date(player.usuario.fecha_nacimiento);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        totalAge += age;
        validPlayers++;
      }
      
      // Goles y partidos
      stats.totalMatches += player.partidos_jugados || 0;
      stats.totalGoals += player.goles || 0;
      
      // Por posición
      const pos = player.usuario?.posicion || 'UNKNOWN';
      if (!stats.byPosition[pos]) {
        stats.byPosition[pos] = 0;
      }
      stats.byPosition[pos]++;
    });
    
    stats.averageAge = validPlayers > 0 ? Math.round(totalAge / validPlayers) : 0;
    setTeamStats(stats);
  };

  // Obtener jugadores por posición (para formación)
  const getPlayersByPosition = (position) => {
    return players.filter(p => {
      const playerPos = p.usuario?.posicion?.substring(0, 3).toUpperCase();
      return playerPos === position;
    });
  };

  // Renderizar campo de fútbol
  const renderPitch = () => {
    const formation = formations[selectedFormation];
    
    return (
      <div className="pitch-container">
        <svg viewBox="0 0 320 480" className="pitch-svg">
          {/* Campo */}
          <rect x="10" y="10" width="300" height="460" fill="#2d5016" stroke="white" strokeWidth="2" />
          
          {/* Línea central */}
          <line x1="160" y1="10" x2="160" y2="470" stroke="white" strokeWidth="1" />
          
          {/* Círculo central */}
          <circle cx="160" cy="240" r="30" fill="none" stroke="white" strokeWidth="1" />
          
          {/* Áreas */}
          <rect x="40" y="10" width="240" height="80" fill="none" stroke="white" strokeWidth="1" />
          <rect x="40" y="380" width="240" height="80" fill="none" stroke="white" strokeWidth="1" />
          
          {/* Arcos de portería */}
          <path d="M 80 80 Q 80 50 160 50 Q 240 50 240 80" fill="none" stroke="white" strokeWidth="1" />
          <path d="M 80 400 Q 80 430 160 430 Q 240 430 240 400" fill="none" stroke="white" strokeWidth="1" />
        </svg>
        
        {/* Tarjetas de jugadores en formación */}
        <div className="formation-players">
          {/* Portero */}
          <div className="formation-row goalkeeper">
            {getPlayersByPosition('GK').slice(0, 1).map(player => (
              <div key={player.id} className="player-card-pitch">
                <div className="player-number">{player.numero_camiseta || '1'}</div>
                <div className="player-name">{player.usuario?.nombre?.split(' ')[0]}</div>
              </div>
            ))}
          </div>
          
          {/* Defensas */}
          <div className="formation-row defenders" style={{ gridTemplateColumns: `repeat(${formation.defenders}, 1fr)` }}>
            {getPlayersByPosition('DEF').slice(0, formation.defenders).map(player => (
              <div key={player.id} className="player-card-pitch" onClick={() => setSelectedPosition(player)}>
                <div className="player-number">{player.numero_camiseta || '2'}</div>
                <div className="player-name">{player.usuario?.nombre?.split(' ')[0]}</div>
              </div>
            ))}
          </div>
          
          {/* Centrocampistas */}
          <div className="formation-row midfielders" style={{ gridTemplateColumns: `repeat(${formation.midfielders}, 1fr)` }}>
            {getPlayersByPosition('MID').slice(0, formation.midfielders).map(player => (
              <div key={player.id} className="player-card-pitch" onClick={() => setSelectedPosition(player)}>
                <div className="player-number">{player.numero_camiseta || '8'}</div>
                <div className="player-name">{player.usuario?.nombre?.split(' ')[0]}</div>
              </div>
            ))}
          </div>
          
          {/* Delanteros */}
          <div className="formation-row forwards" style={{ gridTemplateColumns: `repeat(${formation.forwards}, 1fr)` }}>
            {getPlayersByPosition('FWD').slice(0, formation.forwards).map(player => (
              <div key={player.id} className="player-card-pitch" onClick={() => setSelectedPosition(player)}>
                <div className="player-number">{player.numero_camiseta || '9'}</div>
                <div className="player-name">{player.usuario?.nombre?.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar vista de jugadores en tabla
  const renderPlayersTable = () => {
    return (
      <div className="players-table-container">
        {/* Filtro por posición */}
        <div className="position-filter">
          <button
            className={selectedPosition === null ? 'active' : ''}
            onClick={() => setSelectedPosition(null)}
          >
            Todos
          </button>
          {Object.entries(positions).map(([key, val]) => (
            <button
              key={key}
              className={selectedPosition === key ? 'active' : ''}
              onClick={() => setSelectedPosition(key)}
              style={{ borderColor: val.color }}
            >
              {val.name}
            </button>
          ))}
        </div>
        
        {/* Tabla */}
        <table className="players-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Nombre</th>
              <th>Posición</th>
              <th>Edad</th>
              <th>Partidos</th>
              <th>Goles</th>
              <th>Rating</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {players
              .filter(p => selectedPosition === null || p.usuario?.posicion?.substring(0, 3).toUpperCase() === selectedPosition)
              .map(player => {
                const birthDate = new Date(player.usuario?.fecha_nacimiento);
                const age = new Date().getFullYear() - birthDate.getFullYear();
                const posKey = player.usuario?.posicion?.substring(0, 3).toUpperCase();
                const posData = positions[posKey] || { name: 'Indefinido', color: '#666' };
                
                return (
                  <tr key={player.id} className="player-row">
                    <td className="number">{player.numero_camiseta || '-'}</td>
                    <td className="name">
                      <div className="player-info">
                        <img src={player.usuario?.avatar_url} alt={player.usuario?.nombre} className="player-avatar" />
                        <span>{player.usuario?.nombre} {player.usuario?.apellido}</span>
                      </div>
                    </td>
                    <td>
                      <span className="position-badge" style={{ backgroundColor: posData.color }}>
                        {posData.name}
                      </span>
                    </td>
                    <td className="age">{age}</td>
                    <td className="matches">{player.partidos_jugados || 0}</td>
                    <td className="goals">{player.goles || 0}</td>
                    <td className="rating">
                      <div className="rating-bar">
                        <div className="rating-fill" style={{ width: `${(player.rating || 0) * 10}%` }} />
                      </div>
                      {player.rating || 0}
                    </td>
                    <td className="actions">
                      {isOwner && (
                        <>
                          <button className="btn-small btn-edit">✏️</button>
                          <button className="btn-small btn-delete">🗑️</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  };

  // Renderizar estadísticas
  const renderStats = () => {
    return (
      <div className="stats-container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{teamStats?.totalPlayers || 0}</div>
            <div className="stat-label">Jugadores</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{teamStats?.averageAge || 0}</div>
            <div className="stat-label">Edad Promedio</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{teamStats?.totalMatches || 0}</div>
            <div className="stat-label">Partidos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{teamStats?.totalGoals || 0}</div>
            <div className="stat-label">Goles Totales</div>
          </div>
        </div>
        
        {/* Distribución por posición */}
        <div className="distribution-section">
          <h3>Distribución por Posición</h3>
          <div className="position-distribution">
            {Object.entries(teamStats?.byPosition || {}).map(([pos, count]) => {
              const posData = positions[pos?.substring(0, 3).toUpperCase()] || { name: pos, color: '#666' };
              return (
                <div key={pos} className="distribution-bar">
                  <div className="bar-label">{posData.name}</div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(count / (teamStats?.totalPlayers || 1)) * 100}%`,
                        backgroundColor: posData.color
                      }}
                    />
                  </div>
                  <div className="bar-count">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Top jugadores */}
        <div className="top-players-section">
          <h3>Top Jugadores por Goles</h3>
          <div className="top-list">
            {players
              .sort((a, b) => (b.goles || 0) - (a.goles || 0))
              .slice(0, 5)
              .map((player, idx) => (
                <div key={player.id} className="top-item">
                  <div className="rank">{idx + 1}</div>
                  <div className="info">
                    <div className="player-name">{player.usuario?.nombre}</div>
                    <div className="player-pos">{player.usuario?.posicion}</div>
                  </div>
                  <div className="goals">{player.goles || 0} goles</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="container-mejorado"><div className="loading">Cargando...</div></div>;
  }

  if (error || !team) {
    return (
      <div className="container-mejorado">
        <div className="error-message">{error || 'Equipo no encontrado'}</div>
      </div>
    );
  }

  return (
    <div className="container-mejorado">
      {/* Header del Equipo */}
      <div className="team-header">
        <div className="team-banner" style={{ backgroundImage: `url(${team.logo_url})` }}>
          <div className="team-overlay" />
        </div>
        <div className="team-info">
          <img src={team.logo_url} alt={team.nombre} className="team-logo" />
          <div className="team-details">
            <h1>{team.nombre}</h1>
            <p className="team-category">{team.categoria}</p>
            <p className="team-description">{team.descripcion}</p>
          </div>
          {isOwner && (
            <button className="btn-edit-team" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? '✓ Guardado' : '✏️ Editar Equipo'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={activeTab === 'formacion' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('formacion')}
          >
            ⚽ Formación
          </button>
          <button
            className={activeTab === 'jugadores' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('jugadores')}
          >
            👥 Plantilla ({players.length})
          </button>
          <button
            className={activeTab === 'estadisticas' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('estadisticas')}
          >
            📊 Estadísticas
          </button>
        </div>

        {/* Selector de formación */}
        {activeTab === 'formacion' && (
          <div className="formation-selector">
            {Object.keys(formations).map(form => (
              <button
                key={form}
                className={selectedFormation === form ? 'formation-btn active' : 'formation-btn'}
                onClick={() => setSelectedFormation(form)}
              >
                {form}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contenido por Tab */}
      <div className="content-container">
        {activeTab === 'formacion' && renderPitch()}
        {activeTab === 'jugadores' && renderPlayersTable()}
        {activeTab === 'estadisticas' && renderStats()}
      </div>

      {/* Modal de jugador seleccionado */}
      {selectedPosition && typeof selectedPosition === 'object' && (
        <div className="player-modal" onClick={() => setSelectedPosition(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPosition(null)}>×</button>
            <div className="modal-body">
              <img src={selectedPosition.usuario?.avatar_url} alt={selectedPosition.usuario?.nombre} />
              <div className="modal-info">
                <h2>{selectedPosition.usuario?.nombre} {selectedPosition.usuario?.apellido}</h2>
                <p className="number">Nº {selectedPosition.numero_camiseta}</p>
                <p className="position">{selectedPosition.usuario?.posicion}</p>
                <div className="stats-compact">
                  <div><strong>{selectedPosition.partidos_jugados || 0}</strong> Partidos</div>
                  <div><strong>{selectedPosition.goles || 0}</strong> Goles</div>
                  <div><strong>{selectedPosition.rating || 0}</strong> Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
