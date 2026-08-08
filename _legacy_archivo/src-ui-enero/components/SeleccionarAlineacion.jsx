import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * Modal para seleccionar alineación del equipo para un torneo
 * Permite arrastrar jugadores a posiciones, elegir formación
 */
export default function SeleccionarAlineacion({ 
  teamId, 
  tournamentId, 
  tournamentFormat = '11v11',
  onClose, 
  onSave 
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [formation, setFormation] = useState('4-4-2');
  const [captain, setCaptain] = useState('');
  const [error, setError] = useState('');
  
  const formations = {
    '11v11': ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '3-4-3', '5-3-2'],
    '7v7': ['3-2-1', '2-3-1', '2-2-2'],
    '5v5': ['2-2', '2-1-1', '1-2-1']
  };

  const requiredPlayers = {
    '5v5': 5,
    '7v7': 7,
    '8v8': 8,
    '9v9': 9,
    '11v11': 11
  };

  const minRequired = requiredPlayers[tournamentFormat] || 11;

  useEffect(() => {
    loadPlayers();
    loadExistingLineup();
  }, [teamId, tournamentId]);

  const loadPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          user_email,
          position,
          jersey_number,
          role,
          users!inner(full_name, avatar_url, cards)
        `)
        .eq('team_id', teamId)
        .eq('status', 'active');

      if (error) throw error;

      const formattedPlayers = data?.map(member => ({
        email: member.user_email,
        name: member.users?.full_name || 'Sin nombre',
        position: member.position || 'MID',
        jerseyNumber: member.jersey_number || 0,
        role: member.role,
        avatar: member.users?.avatar_url,
        ovr: member.users?.cards?.[0]?.ovr || 70
      })) || [];

      setPlayers(formattedPlayers);
    } catch (err) {
      console.error('Error cargando jugadores:', err);
      setError('Error al cargar jugadores del equipo');
    }
  };

  const loadExistingLineup = async () => {
    try {
      const { data, error } = await supabase
        .from('team_lineups')
        .select('formation, selected_players, captain_email')
        .eq('team_id', teamId)
        .eq('tournament_id', tournamentId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignorar "not found"

      if (data) {
        setFormation(data.formation);
        setSelectedPlayers(data.selected_players || []);
        setCaptain(data.captain_email || '');
      }
    } catch (err) {
      console.error('Error cargando alineación existente:', err);
    }
  };

  const togglePlayerSelection = (playerEmail) => {
    if (selectedPlayers.includes(playerEmail)) {
      setSelectedPlayers(selectedPlayers.filter(e => e !== playerEmail));
    } else {
      if (selectedPlayers.length >= minRequired + 5) {
        setError(`Máximo ${minRequired + 5} jugadores (${minRequired} titulares + 5 suplentes)`);
        return;
      }
      setSelectedPlayers([...selectedPlayers, playerEmail]);
    }
    setError('');
  };

  const handleSave = async () => {
    if (selectedPlayers.length < minRequired) {
      setError(`Debes seleccionar al menos ${minRequired} jugadores para ${tournamentFormat}`);
      return;
    }

    if (!captain) {
      setError('Debes seleccionar un capitán');
      return;
    }

    setLoading(true);
    try {
      const lineupData = {
        team_id: teamId,
        tournament_id: tournamentId,
        formation,
        selected_players: selectedPlayers,
        captain_email: captain,
        updated_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('team_lineups')
        .upsert(lineupData, { onConflict: 'team_id,tournament_id' });

      if (upsertError) throw upsertError;

      if (onSave) onSave(lineupData);
      onClose();
    } catch (err) {
      console.error('Error guardando alineación:', err);
      setError('Error al guardar la alineación');
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position) => {
    if (['GK'].includes(position)) return '#F39C12';
    if (['CB', 'LB', 'RB', 'DEF'].includes(position)) return '#2ECC71';
    if (['CDM', 'CM', 'CAM', 'LM', 'RM', 'MID'].includes(position)) return '#3498DB';
    if (['LW', 'RW', 'ST', 'CF', 'FWD'].includes(position)) return '#E74C3C';
    return '#95A5A6';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        border: '2px solid #FFD700',
        borderRadius: '16px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))'
        }}>
          <div>
            <h2 style={{
              fontSize: '28px',
              color: '#FFD700',
              margin: 0,
              marginBottom: '8px'
            }}>
              ⚽ Seleccionar Alineación
            </h2>
            <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>
              Selecciona {minRequired} jugadores titulares para {tournamentFormat} (+ hasta 5 suplentes)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFD700',
              fontSize: '32px',
              cursor: 'pointer',
              padding: '0 8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{
              background: 'rgba(231,76,60,0.2)',
              border: '1px solid #E74C3C',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#E74C3C'
            }}>
              {error}
            </div>
          )}

          {/* Selector de Formación */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              Formación
            </label>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {(formations[tournamentFormat] || formations['11v11']).map(f => (
                <button
                  key={f}
                  onClick={() => setFormation(f)}
                  style={{
                    padding: '10px 20px',
                    background: formation === f 
                      ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                      : '#2a2a2a',
                    color: formation === f ? '#000' : '#FFD700',
                    border: formation === f ? 'none' : '1px solid #FFD700',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Stats de selección */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            padding: '16px',
            background: 'rgba(255,215,0,0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255,215,0,0.2)'
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: selectedPlayers.length >= minRequired ? '#2ECC71' : '#E74C3C'
              }}>
                {selectedPlayers.length}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>
                Jugadores seleccionados
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#FFD700'
              }}>
                {minRequired}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>
                Mínimo requerido
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#3498DB'
              }}>
                {players.length}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>
                Total disponibles
              </div>
            </div>
          </div>

          {/* Lista de jugadores */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#FFD700', marginBottom: '16px', fontSize: '18px' }}>
              🎮 Jugadores Disponibles
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '8px'
            }}>
              {players.map(player => {
                const isSelected = selectedPlayers.includes(player.email);
                const isCaptain = captain === player.email;
                
                return (
                  <div
                    key={player.email}
                    onClick={() => togglePlayerSelection(player.email)}
                    style={{
                      background: isSelected ? 'rgba(255,215,0,0.2)' : '#1a1a1a',
                      border: isSelected ? '2px solid #FFD700' : '1px solid #333',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {/* Badge capitán */}
                    {isCaptain && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#FFD700',
                        color: '#000',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        👑 CAP
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: `2px solid ${getPositionColor(player.position)}`,
                        background: '#0a0a0a'
                      }}>
                        {player.avatar ? (
                          <img 
                            src={player.avatar} 
                            alt={player.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            background: getPositionColor(player.position)
                          }}>
                            {player.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#FFD700',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          #{player.jerseyNumber} {player.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#aaa',
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          marginTop: '4px'
                        }}>
                          <span style={{
                            background: getPositionColor(player.position),
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            {player.position}
                          </span>
                          <span style={{ color: '#FFD700' }}>
                            {player.ovr} OVR
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botón capitán */}
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCaptain(player.email);
                        }}
                        style={{
                          width: '100%',
                          padding: '6px',
                          background: isCaptain ? '#FFD700' : 'transparent',
                          color: isCaptain ? '#000' : '#FFD700',
                          border: '1px solid #FFD700',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          marginTop: '8px'
                        }}
                      >
                        {isCaptain ? '👑 Capitán' : 'Hacer Capitán'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer con acciones */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '16px',
            borderTop: '1px solid #333'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: '#FFD700',
                border: '1px solid #FFD700',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading || selectedPlayers.length < minRequired || !captain}
              style={{
                padding: '12px 32px',
                background: (loading || selectedPlayers.length < minRequired || !captain)
                  ? '#555'
                  : 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: (loading || selectedPlayers.length < minRequired || !captain) 
                  ? 'not-allowed' 
                  : 'pointer',
                opacity: (loading || selectedPlayers.length < minRequired || !captain) ? 0.5 : 1
              }}
            >
              {loading ? '💾 Guardando...' : '✅ Guardar Alineación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
