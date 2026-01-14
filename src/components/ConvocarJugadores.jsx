import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const ConvocarJugadores = ({ teamId, onInviteSent }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState('nombre'); // 'nombre' | 'ubicacion'
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [championship, setChampionship] = useState('futbol11');
  const [category, setCategory] = useState('masculina');
  const [maxAge, setMaxAge] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const championshipOptions = [
    { value: 'futsal', label: 'Futsal 5', positions: 5 },
    { value: 'microfutbol', label: 'Microfútbol 5', positions: 5 },
    { value: 'futbol5', label: 'Fútbol 5', positions: 5 },
    { value: 'futbol6', label: 'Fútbol 6', positions: 6 },
    { value: 'futbol7', label: 'Fútbol 7', positions: 7 },
    { value: 'futbol8', label: 'Fútbol 8', positions: 8 },
    { value: 'futbol9', label: 'Fútbol 9', positions: 9 },
    { value: 'futbol10', label: 'Fútbol 10', positions: 10 },
    { value: 'futbol11', label: 'Fútbol 11', positions: 11 },
    { value: 'banquita1v1', label: 'Banquita 1v1', positions: 2 },
    { value: 'banquita2v2', label: 'Banquita 2v2', positions: 4 },
    { value: 'banquita3v3', label: 'Banquita 3v3', positions: 6 },
    { value: 'banquita4v4', label: 'Banquita 4v4', positions: 8 },
    { value: 'banquita5v5', label: 'Banquita 5v5', positions: 10 },
    { value: 'penaltis', label: 'Torneo de Penaltis', positions: 10 }
  ];

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    buscarJugadores();
  }, [searchQuery, mode]);

  const buscarJugadores = async () => {
    setLoading(true);
    setError('');
    try {
      let query = supabase.from('available_players_for_convocation').select('*');

      if (mode === 'nombre') {
        const [nombre, apellido] = searchQuery.trim().split(' ');
        query = query.or(
          `nombre.ilike.%${nombre}%,apellido.ilike.%${apellido || nombre}%`
        );
      } else if (mode === 'ubicacion') {
        query = query.or(
          `ciudad.ilike.%${searchQuery}%,pais.ilike.%${searchQuery}%`
        );
      }

      if (maxAge) {
        query = query.lte('edad', maxAge);
      }

      const { data, error: err } = await query.limit(20);
      if (err) throw err;

      setResults(data || []);
    } catch (e) {
      setError('Error en búsqueda: ' + (e.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectPlayer = (playerId) => {
    setSelectedPlayers(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const enviarInvitaciones = async () => {
    if (selectedPlayers.length === 0) {
      setError('Selecciona al menos 1 jugador');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const invitations = selectedPlayers.map(playerId => ({
        team_id: teamId,
        invited_user_id: playerId,
        inviter_id: user.id,
        championship_type: championship,
        category,
        max_age: maxAge
      }));

      const { error: err } = await supabase
        .from('team_invitations')
        .insert(invitations);

      if (err) throw err;

      setSuccess(`✅ ${selectedPlayers.length} invitación(es) enviada(s)`);
      setSelectedPlayers([]);
      setSearchQuery('');
      onInviteSent?.();

      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Error al enviar invitaciones: ' + (e.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
      borderRadius: 12,
      padding: 20,
      color: '#fff',
      border: '1px solid #FFD700'
    }}>
      <h3 style={{ color: '#FFD700', marginBottom: 16 }}>🎯 Convocar Jugadores</h3>

      {/* Tipo de búsqueda */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => { setMode('nombre'); setSearchQuery(''); setResults([]); }}
          style={{
            background: mode === 'nombre' ? '#FFD700' : 'rgba(255,215,0,0.2)',
            color: mode === 'nombre' ? '#000' : '#FFD700',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          👤 Por Nombre
        </button>
        <button
          onClick={() => { setMode('ubicacion'); setSearchQuery(''); setResults([]); }}
          style={{
            background: mode === 'ubicacion' ? '#FFD700' : 'rgba(255,215,0,0.2)',
            color: mode === 'ubicacion' ? '#000' : '#FFD700',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📍 Por Ubicación
        </button>
      </div>

      {/* Búsqueda */}
      <input
        type="text"
        placeholder={mode === 'nombre' ? 'Ej: Juan Pérez' : 'Ej: Bogotá, Colombia'}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={loading}
        style={{
          width: '100%',
          padding: 10,
          marginBottom: 12,
          borderRadius: 6,
          border: '1px solid #FFD700',
          background: 'rgba(0,0,0,0.5)',
          color: '#fff'
        }}
      />

      {/* Filtros */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        <div>
          <label style={{ color: '#FFD700', fontSize: 12, fontWeight: 'bold', display: 'block', marginBottom: 4 }}>
            Campeonato
          </label>
          <select
            value={championship}
            onChange={(e) => setChampionship(e.target.value)}
            style={{
              width: '100%',
              padding: 6,
              borderRadius: 4,
              border: '1px solid #FFD700',
              background: 'rgba(0,0,0,0.5)',
              color: '#fff'
            }}
          >
            {championshipOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ color: '#FFD700', fontSize: 12, fontWeight: 'bold', display: 'block', marginBottom: 4 }}>
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: 6,
              borderRadius: 4,
              border: '1px solid #FFD700',
              background: 'rgba(0,0,0,0.5)',
              color: '#fff'
            }}
          >
            <option value="masculina">Masculina</option>
            <option value="femenina">Femenina</option>
            <option value="infantil">Infantil</option>
            <option value="mixto">Mixto</option>
          </select>
        </div>
        <div>
          <label style={{ color: '#FFD700', fontSize: 12, fontWeight: 'bold', display: 'block', marginBottom: 4 }}>
            Edad Máxima
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={maxAge || ''}
            onChange={(e) => setMaxAge(e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Sin límite"
            style={{
              width: '100%',
              padding: 6,
              borderRadius: 4,
              border: '1px solid #FFD700',
              background: 'rgba(0,0,0,0.5)',
              color: '#fff'
            }}
          />
        </div>
      </div>

      {/* Resultados */}
      {loading && <div style={{ color: '#FFD700', textAlign: 'center', padding: 20 }}>🔍 Buscando...</div>}

      {results.length > 0 && (
        <div style={{ marginBottom: 16, maxHeight: 300, overflowY: 'auto' }}>
          {results.map(player => (
            <div
              key={player.id}
              onClick={() => toggleSelectPlayer(player.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 12,
                marginBottom: 8,
                background: selectedPlayers.includes(player.id) ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                borderRadius: 6,
                border: selectedPlayers.includes(player.id) ? '2px solid #FFD700' : '1px solid #333',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={selectedPlayers.includes(player.id)}
                onChange={() => {}}
                style={{ width: 18, height: 18 }}
              />
              <img src={player.photo_url || player.avatar_url || 'https://i.pravatar.cc/40'} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#FFD700' }}>
                  {player.nombre} {player.apellido}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  {player.ciudad || '—'}, {player.pais || '—'} • {player.edad || '—'} años
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#FFD700' }}>
                {player.posicion || '—'}
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && searchQuery && !loading && (
        <div style={{ color: '#888', textAlign: 'center', padding: 20 }}>
          No se encontraron jugadores
        </div>
      )}

      {/* Mensajes */}
      {error && <div style={{ color: '#FF6B6B', marginBottom: 12, fontSize: 12 }}>{error}</div>}
      {success && <div style={{ color: '#2ecc71', marginBottom: 12, fontSize: 12 }}>{success}</div>}

      {/* Botón enviar */}
      {selectedPlayers.length > 0 && (
        <button
          onClick={enviarInvitaciones}
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            background: '#FFD700',
            color: '#000',
            border: 'none',
            borderRadius: 6,
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          📮 Enviar {selectedPlayers.length} Invitación(es)
        </button>
      )}
    </div>
  );
};

export default ConvocarJugadores;
