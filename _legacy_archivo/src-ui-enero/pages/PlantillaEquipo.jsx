import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

// Formaciones por tipo de campeonato
const FORMATIONS = {
  futbol11: {
    name: 'Fútbol 11',
    maxPlayers: 11,
    formations: {
      '4-4-2': [
        { position: 'POR', x: 50, y: 95 },
        { position: 'DFC', x: 25, y: 75 }, { position: 'DFC', x: 50, y: 75 }, { position: 'DFC', x: 75, y: 75 },
        { position: 'LI', x: 10, y: 75 }, { position: 'LD', x: 90, y: 75 },
        { position: 'MC', x: 30, y: 50 }, { position: 'MC', x: 70, y: 50 },
        { position: 'MI', x: 20, y: 35 }, { position: 'MD', x: 80, y: 35 },
        { position: 'DC', x: 40, y: 10 }, { position: 'DC', x: 60, y: 10 }
      ],
      '4-3-3': [
        { position: 'POR', x: 50, y: 95 },
        { position: 'LI', x: 10, y: 75 }, { position: 'DFC', x: 35, y: 80 }, { position: 'DFC', x: 65, y: 80 }, { position: 'LD', x: 90, y: 75 },
        { position: 'MC', x: 50, y: 55 }, { position: 'MC', x: 30, y: 55 }, { position: 'MC', x: 70, y: 55 },
        { position: 'EI', x: 15, y: 15 }, { position: 'DC', x: 50, y: 10 }, { position: 'ED', x: 85, y: 15 }
      ]
    }
  },
  futbol7: {
    name: 'Fútbol 7',
    maxPlayers: 7,
    formations: {
      '2-3-1': [
        { position: 'POR', x: 50, y: 92 },
        { position: 'DFC', x: 35, y: 75 }, { position: 'DFC', x: 65, y: 75 },
        { position: 'MC', x: 25, y: 50 }, { position: 'MC', x: 50, y: 50 }, { position: 'MC', x: 75, y: 50 },
        { position: 'DC', x: 50, y: 15 }
      ],
      '3-2-1': [
        { position: 'POR', x: 50, y: 92 },
        { position: 'DFC', x: 25, y: 70 }, { position: 'DFC', x: 50, y: 75 }, { position: 'DFC', x: 75, y: 70 },
        { position: 'MC', x: 35, y: 45 }, { position: 'MC', x: 65, y: 45 },
        { position: 'DC', x: 50, y: 12 }
      ]
    }
  },
  futbol5: {
    name: 'Fútbol 5',
    maxPlayers: 5,
    formations: {
      '1-2-1': [
        { position: 'POR', x: 50, y: 90 },
        { position: 'DFC', x: 50, y: 70 },
        { position: 'MC', x: 30, y: 45 }, { position: 'MC', x: 70, y: 45 },
        { position: 'DC', x: 50, y: 12 }
      ]
    }
  },
  futsal: {
    name: 'Futsal',
    maxPlayers: 5,
    formations: {
      '1-2-1': [
        { position: 'POR', x: 50, y: 90 },
        { position: 'DFC', x: 50, y: 65 },
        { position: 'ALA', x: 25, y: 40 }, { position: 'ALA', x: 75, y: 40 },
        { position: 'PIVOT', x: 50, y: 15 }
      ]
    }
  },
  microfutbol: {
    name: 'Micro Fútbol',
    maxPlayers: 5,
    formations: {
      '1-2-1': [
        { position: 'POR', x: 50, y: 90 },
        { position: 'DFC', x: 50, y: 65 },
        { position: 'MC', x: 30, y: 40 }, { position: 'MC', x: 70, y: 40 },
        { position: 'DC', x: 50, y: 12 }
      ]
    }
  },
  banquitas1v1: { name: 'Banquitas 1vs1', maxPlayers: 1, formations: { '1': [{ position: 'JUG', x: 50, y: 50 }] } },
  banquitas2v2: { name: 'Banquitas 2vs2', maxPlayers: 2, formations: { '2': [{ position: 'JUG', x: 40, y: 50 }, { position: 'JUG', x: 60, y: 50 }] } },
  banquitas3v3: { name: 'Banquitas 3vs3', maxPlayers: 3, formations: { '1-2': [{ position: 'POR', x: 50, y: 85 }, { position: 'JUG', x: 35, y: 35 }, { position: 'JUG', x: 65, y: 35 }] } },
  banquitas4v4: { name: 'Banquitas 4vs4', maxPlayers: 4, formations: { '1-2-1': [{ position: 'POR', x: 50, y: 88 }, { position: 'DFC', x: 50, y: 60 }, { position: 'MC', x: 35, y: 35 }, { position: 'DC', x: 50, y: 12 }] } },
  banquitas5v5: { name: 'Banquitas 5vs5', maxPlayers: 5, formations: { '1-2-1': [{ position: 'POR', x: 50, y: 90 }, { position: 'DFC', x: 50, y: 65 }, { position: 'MC', x: 30, y: 40 }, { position: 'MC', x: 70, y: 40 }, { position: 'DC', x: 50, y: 12 }] } },
  penaltis: { name: 'Torneo de Penaltis', maxPlayers: 1, formations: { '1': [{ position: 'TIRADOR', x: 50, y: 40 }] } }
};

export default function PlantillaEquipo() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [lineup, setLineup] = useState(null);
  const [players, setPlayers] = useState([]);
  const [tournamentType, setTournamentType] = useState('futbol11');
  const [selectedFormation, setSelectedFormation] = useState('4-4-2');
  const [editMode, setEditMode] = useState(false);
  const [assignedPlayers, setAssignedPlayers] = useState({});

  useEffect(() => {
    loadTeam();
    loadPlayers();
  }, [teamId]);

  useEffect(() => {
    if (team && team.tournament_type) {
      setTournamentType(team.tournament_type);
      const firstFormation = Object.keys(FORMATIONS[team.tournament_type]?.formations || {})[0];
      setSelectedFormation(firstFormation || '4-4-2');
      loadLineup(team.tournament_type);
    }
  }, [team]);

  const loadTeam = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();
      if (error) throw error;
      setTeam(data);
    } catch (err) {
      console.error('Error cargando equipo:', err);
    }
  };

  const loadLineup = async (type) => {
    try {
      const { data, error } = await supabase
        .from('team_lineups')
        .select('*')
        .eq('team_id', teamId)
        .eq('tournament_type', type)
        .maybeSingle();
      
      if (data) {
        setLineup(data);
        setAssignedPlayers(data.players_json || {});
      }
    } catch (err) {
      console.error('Error cargando alineación:', err);
    }
  };

  const loadPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*, player:carfutpro!invited_player_id(id, nombre, apellido, avatar_url, posicion, numero_camisa)')
        .eq('team_id', teamId)
        .eq('status', 'accepted');
      
      if (error) throw error;
      setPlayers(data?.map(inv => inv.player).filter(Boolean) || []);
    } catch (err) {
      console.error('Error cargando jugadores:', err);
    }
  };

  const saveLineup = async () => {
    try {
      const formationConfig = FORMATIONS[tournamentType];
      const positionsInFormation = formationConfig.formations[selectedFormation];

      if (!lineup) {
        // Crear nueva alineación
        const { error } = await supabase
          .from('team_lineups')
          .insert([{
            team_id: teamId,
            tournament_type: tournamentType,
            formation_name: selectedFormation,
            players_json: assignedPlayers,
            max_players: formationConfig.maxPlayers
          }]);
        if (error) throw error;
      } else {
        // Actualizar existente
        const { error } = await supabase
          .from('team_lineups')
          .update({
            formation_name: selectedFormation,
            players_json: assignedPlayers
          })
          .eq('id', lineup.id);
        if (error) throw error;
      }

      alert('Alineación guardada exitosamente');
      setEditMode(false);
      loadLineup(tournamentType);
    } catch (err) {
      console.error('Error guardando alineación:', err);
      alert('Error al guardar alineación');
    }
  };

  const assignPlayer = (positionIndex, playerId) => {
    setAssignedPlayers({ ...assignedPlayers, [positionIndex]: playerId });
  };

  const formationConfig = FORMATIONS[tournamentType];
  const positions = formationConfig?.formations[selectedFormation] || [];

  return (
    <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', minHeight: '100vh', padding: 32, color: '#FFD700' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '2px solid #FFD700', color: '#FFD700', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: 20 }}>← Volver</button>
        
        <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 8 }}>⚽ Plantilla y Alineación</h1>
        <h2 style={{ fontSize: 24, color: '#FFD70099', marginBottom: 32 }}>{team?.name || 'Cargando...'}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          {/* Campo de juego */}
          <div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <label style={{ marginRight: 12, fontWeight: 'bold' }}>Tipo de campeonato:</label>
                  <select value={tournamentType} onChange={(e) => { setTournamentType(e.target.value); loadLineup(e.target.value); }} disabled={!editMode} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 8 }}>
                    {Object.keys(FORMATIONS).map(key => (
                      <option key={key} value={key}>{FORMATIONS[key].name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ marginRight: 12, fontWeight: 'bold' }}>Formación:</label>
                  <select value={selectedFormation} onChange={(e) => setSelectedFormation(e.target.value)} disabled={!editMode} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: 8 }}>
                    {Object.keys(formationConfig?.formations || {}).map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>✏️ Editar Alineación</button>
                ) : (
                  <>
                    <button onClick={saveLineup} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>💾 Guardar</button>
                    <button onClick={() => { setEditMode(false); loadLineup(tournamentType); }} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>✖️ Cancelar</button>
                  </>
                )}
              </div>
            </div>

            {/* Campo */}
            <div style={{ 
              background: 'linear-gradient(180deg, #2d8659 0%, #1a5c3a 50%, #2d8659 100%)', 
              borderRadius: 16, 
              position: 'relative', 
              height: 700, 
              border: '3px solid white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>
              {/* Líneas del campo */}
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'white', opacity: 0.6 }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 120, height: 120, border: '2px solid white', borderRadius: '50%', opacity: 0.6 }}></div>
              <div style={{ position: 'absolute', top: 0, left: '35%', width: '30%', height: 80, border: '2px solid white', borderTop: 'none', opacity: 0.6 }}></div>
              <div style={{ position: 'absolute', bottom: 0, left: '35%', width: '30%', height: 80, border: '2px solid white', borderBottom: 'none', opacity: 0.6 }}></div>

              {/* Posiciones */}
              {positions.map((pos, idx) => {
                const playerId = assignedPlayers[idx];
                const player = players.find(p => p.id === playerId);
                
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      cursor: editMode ? 'pointer' : 'default'
                    }}
                  >
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: player ? `url(${player.avatar_url})` : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '3px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#000',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}>
                      {player ? player.numero_camisa || '?' : '?'}
                    </div>
                    <div style={{ 
                      background: 'rgba(0,0,0,0.8)', 
                      color: '#FFD700', 
                      padding: '4px 8px', 
                      borderRadius: 6, 
                      marginTop: 6, 
                      fontSize: 11, 
                      fontWeight: 'bold',
                      border: '1px solid #FFD700'
                    }}>
                      {pos.position}
                    </div>
                    {player && (
                      <div style={{ 
                        background: 'rgba(255,255,255,0.95)', 
                        color: '#000', 
                        padding: '3px 6px', 
                        borderRadius: 4, 
                        marginTop: 4, 
                        fontSize: 10, 
                        fontWeight: 'bold'
                      }}>
                        {player.nombre} {player.apellido}
                      </div>
                    )}
                    {editMode && (
                      <select
                        value={playerId || ''}
                        onChange={(e) => assignPlayer(idx, e.target.value)}
                        style={{
                          marginTop: 8,
                          background: '#232323',
                          color: '#FFD700',
                          border: '1px solid #FFD700',
                          borderRadius: 6,
                          padding: 4,
                          fontSize: 11,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Sin asignar</option>
                        {players.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} {p.apellido} ({p.posicion})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de jugadores */}
          <div>
            <h3 style={{ fontSize: 24, marginBottom: 16 }}>👥 Jugadores Disponibles</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16 }}>
              {players.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', padding: 32 }}>
                  No hay jugadores aceptados aún.
                  <br />
                  <button onClick={() => navigate(`/convocar-jugadores/${teamId}`)} style={{ marginTop: 16, background: '#FFD700', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Convocar Jugadores
                  </button>
                </div>
              ) : (
                players.map(player => (
                  <div key={player.id} style={{ 
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)', 
                    padding: 12, 
                    borderRadius: 8, 
                    marginBottom: 12,
                    border: '1px solid rgba(255,215,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <img src={player.avatar_url || 'https://via.placeholder.com/50'} alt="" style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid #FFD700' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 15 }}>{player.nombre} {player.apellido}</div>
                      <div style={{ fontSize: 12, color: '#FFD70099' }}>{player.posicion} • #{player.numero_camisa || '?'}</div>
                    </div>
                    <div style={{ 
                      background: Object.values(assignedPlayers).includes(player.id) ? '#2ecc71' : '#666', 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%' 
                    }}></div>
                  </div>
                ))
              )}
            </div>

            {players.length > 0 && (
              <div style={{ marginTop: 20, background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12 }}>
                <h4 style={{ fontSize: 18, marginBottom: 12 }}>📊 Resumen</h4>
                <div style={{ fontSize: 14, color: '#FFD70099' }}>
                  <div>Jugadores totales: {players.length}</div>
                  <div>Posiciones asignadas: {Object.keys(assignedPlayers).filter(k => assignedPlayers[k]).length}</div>
                  <div>Posiciones libres: {positions.length - Object.keys(assignedPlayers).filter(k => assignedPlayers[k]).length}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
