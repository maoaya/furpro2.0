import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const TOURNAMENT_TYPES = [
  { value: 'futbol2', label: 'Fútbol 2' },
  { value: 'futbol5', label: 'Fútbol 5' },
  { value: 'futbol6', label: 'Fútbol 6' },
  { value: 'futbol7', label: 'Fútbol 7' },
  { value: 'futbol8', label: 'Fútbol 8' },
  { value: 'futbol9', label: 'Fútbol 9' },
  { value: 'futbol10', label: 'Fútbol 10' },
  { value: 'futbol11', label: 'Fútbol 11' },
  { value: 'futsal5', label: 'Futsal 5' },
  { value: 'microfutbol5', label: 'Microfútbol 5' },
  { value: 'banquitas1v1', label: 'Banquitas 1vs1' },
  { value: 'banquitas2v2', label: 'Banquitas 2vs2' },
  { value: 'banquitas3v3', label: 'Banquitas 3vs3' },
  { value: 'banquitas4v4', label: 'Banquitas 4vs4' },
  { value: 'banquitas5v5', label: 'Banquitas 5vs5' },
  { value: 'penaltis', label: 'Torneo de Penaltis' }
];

const CATEGORIES = [
  { value: 'masculina', label: 'Masculina' },
  { value: 'femenina', label: 'Femenina' },
  { value: 'infantil_masculina', label: 'Infantil Masculina' },
  { value: 'infantil_femenina', label: 'Infantil Femenina' },
  { value: 'mixto', label: 'Mixto' }
];

const POSITIONS = [
  'Portero',
  'Defensa Central',
  'Lateral Derecho',
  'Lateral Izquierdo',
  'Pivote',
  'Mediocentro',
  'Medio Derecho',
  'Medio Izquierdo',
  'Mediapunta',
  'Extremo Derecho',
  'Extremo Izquierdo',
  'Delantero Centro',
  'Segunda Punta'
];

export default function ConvocarJugadores() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('nombre'); // 'nombre' o 'ubicacion'
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    tournamentType: '',
    category: '',
    position: '',
    minAge: '',
    maxAge: ''
  });
  const [inviting, setInviting] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const loadTeam = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) throw error;

      if (data.captain_id !== user?.id) {
        setError('Solo el capitán puede convocar jugadores');
        setTimeout(() => navigate('/equipos'), 2000);
        return;
      }

      setTeam(data);
    } catch (err) {
      console.error('Error cargando equipo:', err);
      setError('Error al cargar el equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Ingresa un término de búsqueda');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let query = supabase
        .from('carfutpro')
        .select('*');

      if (searchType === 'nombre') {
        const terms = searchQuery.trim().split(' ');
        if (terms.length >= 2) {
          query = query.or(`nombre.ilike.%${terms[0]}%,apellido.ilike.%${terms[1]}%`);
        } else {
          query = query.or(`nombre.ilike.%${searchQuery}%,apellido.ilike.%${searchQuery}%`);
        }
      } else {
        query = query.or(`ciudad.ilike.%${searchQuery}%,pais.ilike.%${searchQuery}%`);
      }

      // Aplicar filtros adicionales
      if (filters.category) {
        query = query.eq('categoria', filters.category);
      }
      if (filters.position) {
        query = query.ilike('posicion', `%${filters.position}%`);
      }
      if (filters.minAge) {
        query = query.gte('edad', parseInt(filters.minAge));
      }
      if (filters.maxAge) {
        query = query.lte('edad', parseInt(filters.maxAge));
      }

      const { data, error: searchError } = await query.limit(20);

      if (searchError) throw searchError;

      // Filtrar el equipo actual (no mostrarse a sí mismo)
      const filtered = (data || []).filter(p => p.user_id !== user?.id);
      setResults(filtered);

      if (filtered.length === 0) {
        setError('No se encontraron jugadores con esos criterios');
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error al buscar jugadores');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (playerId) => {
    setInviting(prev => ({ ...prev, [playerId]: true }));
    setSuccess('');
    setError('');

    try {
      const { error: inviteError } = await supabase
        .from('team_invitations')
        .insert([{
          team_id: teamId,
          invited_user_id: playerId,
          invited_by_user_id: user?.id,
          tournament_type: filters.tournamentType || null,
          category: filters.category || null,
          position: filters.position || null,
          max_age: filters.maxAge ? parseInt(filters.maxAge) : null,
          min_age: filters.minAge ? parseInt(filters.minAge) : null,
          status: 'pending'
        }]);

      if (inviteError) throw inviteError;

      setSuccess('✅ Invitación enviada exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error enviando invitación:', err);
      setError('Error al enviar invitación: ' + err.message);
    } finally {
      setInviting(prev => ({ ...prev, [playerId]: false }));
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>⚽ Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', padding: '32px 16px', color: '#fff' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button onClick={() => navigate(`/equipo/${teamId}`)} style={{ background: '#333', color: '#FFD700', border: 'none', borderRadius: '8px', padding: '8px 16px', marginBottom: '16px', cursor: 'pointer' }}>
          ← Volver a mi equipo
        </button>

        <h1 style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '8px' }}>Convocar Jugadores</h1>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '24px' }}>{team?.name}</h2>

        {/* Filtros de convocatoria */}
        <div style={{ background: 'rgba(255,215,0,0.1)', border: '2px solid #FFD700', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <h3 style={{ color: '#FFD700', marginBottom: '12px' }}>Filtros de Convocatoria</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <select value={filters.tournamentType} onChange={(e) => setFilters({ ...filters, tournamentType: e.target.value })} style={{ background: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '8px', padding: '10px' }}>
              <option value="">Tipo de campeonato</option>
              {TOURNAMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} style={{ background: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '8px', padding: '10px' }}>
              <option value="">Categoría</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>

            <select value={filters.position} onChange={(e) => setFilters({ ...filters, position: e.target.value })} style={{ background: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '8px', padding: '10px' }}>
              <option value="">Posición</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <input type="number" placeholder="Edad mínima" value={filters.minAge} onChange={(e) => setFilters({ ...filters, minAge: e.target.value })} style={{ background: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '8px', padding: '10px' }} />

            <input type="number" placeholder="Edad máxima" value={filters.maxAge} onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })} style={{ background: '#1a1a1a', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '8px', padding: '10px' }} />
          </div>
        </div>

        {/* Búsqueda */}
        <div style={{ background: '#1a1a1a', border: '2px solid #FFD700', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <button onClick={() => setSearchType('nombre')} style={{ flex: 1, background: searchType === 'nombre' ? '#FFD700' : '#333', color: searchType === 'nombre' ? '#000' : '#FFD700', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              🔍 Buscar por Nombre
            </button>
            <button onClick={() => setSearchType('ubicacion')} style={{ flex: 1, background: searchType === 'ubicacion' ? '#FFD700' : '#333', color: searchType === 'ubicacion' ? '#000' : '#FFD700', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              📍 Buscar por Ubicación
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder={searchType === 'nombre' ? 'Nombre o apellido del jugador' : 'Ciudad, país o región'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{ flex: 1, background: '#0a0a0a', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '8px', padding: '12px', fontSize: '1rem' }}
            />
            <button onClick={handleSearch} disabled={loading} style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {success && <div style={{ background: '#2ecc71', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 'bold' }}>{success}</div>}
        {error && <div style={{ background: '#e74c3c', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

        {/* Resultados */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {results.map(player => (
            <div key={player.id} style={{ background: '#1a1a1a', border: '2px solid #FFD700', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img src={player.photo_url || player.avatar_url || 'https://i.pravatar.cc/300'} alt={player.nombre} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #FFD700' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>{player.nombre} {player.apellido}</div>
                  <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{player.posicion || 'Sin posición'}</div>
                </div>
              </div>

              <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '8px' }}>
                <div>📍 {player.ciudad || '—'}, {player.pais || '—'}</div>
                <div>🎂 {player.edad ? `${player.edad} años` : '—'}</div>
                <div>⚽ {player.categoria || '—'}</div>
              </div>

              <button
                onClick={() => handleInvite(player.user_id)}
                disabled={inviting[player.user_id]}
                style={{ width: '100%', background: inviting[player.user_id] ? '#666' : '#FFD700', color: '#000', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer', opacity: inviting[player.user_id] ? 0.6 : 1 }}
              >
                {inviting[player.user_id] ? 'Enviando...' : '📨 Invitar al Equipo'}
              </button>
            </div>
          ))}
        </div>

        {results.length === 0 && !loading && searchQuery && (
          <div style={{ textAlign: 'center', color: '#888', padding: '32px' }}>
            No se encontraron jugadores. Intenta ajustar los filtros.
          </div>
        )}
      </div>
    </div>
  );
}
