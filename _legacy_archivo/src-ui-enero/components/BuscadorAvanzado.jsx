import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function BuscadorAvanzado() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tipo, setTipo] = useState('todos');
  const [categoria, setCategoria] = useState('todos');
  const [ubicacion, setUbicacion] = useState('');
  const [resultados, setResultados] = useState({
    jugadores: [],
    equipos: [],
    torneos: []
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const buscar = async () => {
    if (!query.trim() && !ubicacion.trim()) return;
    
    setLoading(true);
    const results = { jugadores: [], equipos: [], torneos: [] };

    try {
      // Buscar jugadores
      if (tipo === 'todos' || tipo === 'jugadores') {
        const { data: jugadores } = await supabase
          .from('users')
          .select('id, full_name, email, position, category, location, ovr')
          .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(10);

        if (jugadores) {
          results.jugadores = jugadores.filter(j => {
            const matchCategoria = categoria === 'todos' || j.category === categoria;
            const matchUbicacion = !ubicacion || j.location?.toLowerCase().includes(ubicacion.toLowerCase());
            return matchCategoria && matchUbicacion;
          });
        }
      }

      // Buscar equipos
      if (tipo === 'todos' || tipo === 'equipos') {
        const { data: equipos } = await supabase
          .from('teams')
          .select('id, name, description, category, location, max_players')
          .ilike('name', `%${query}%`)
          .limit(10);

        if (equipos) {
          results.equipos = equipos.filter(e => {
            const matchCategoria = categoria === 'todos' || e.category === categoria;
            const matchUbicacion = !ubicacion || e.location?.toLowerCase().includes(ubicacion.toLowerCase());
            return matchCategoria && matchUbicacion;
          });
        }
      }

      // Buscar torneos
      if (tipo === 'todos' || tipo === 'torneos') {
        const { data: torneos } = await supabase
          .from('tournaments')
          .select('id, name, description, type, category, location, start_date')
          .ilike('name', `%${query}%`)
          .limit(10);

        if (torneos) {
          results.torneos = torneos.filter(t => {
            const matchCategoria = categoria === 'todos' || t.category === categoria;
            const matchUbicacion = !ubicacion || t.location?.toLowerCase().includes(ubicacion.toLowerCase());
            return matchCategoria && matchUbicacion;
          });
        }
      }
    } catch (err) {
      console.log('Error en búsqueda:', err);
    }

    setResultados(results);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2 || ubicacion.length >= 2) {
        buscar();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, tipo, categoria, ubicacion]);

  const JugadorCard = ({ jugador }) => (
    <div
      onClick={() => navigate(`/usuario/${jugador.id}`)}
      style={{
        background: '#181818',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        ':hover': {
          borderColor: '#FFD700',
          transform: 'translateY(-2px)'
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FFD700';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#333';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>
          👤
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px' }}>
            {jugador.full_name || 'Jugador'}
          </div>
          <div style={{ color: '#aaa', fontSize: '14px', marginTop: '4px' }}>
            {jugador.position || 'Posición'} • OVR {jugador.ovr || 75}
          </div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
            📍 {jugador.location || 'Ubicación desconocida'}
          </div>
        </div>
        <div style={{
          background: '#FFD700',
          color: '#000',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '20px'
        }}>
          {jugador.ovr || 75}
        </div>
      </div>
    </div>
  );

  const EquipoCard = ({ equipo }) => (
    <div
      onClick={() => navigate(`/equipo/${equipo.id}`)}
      style={{
        background: '#181818',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FFD700';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#333';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #00ff88, #00ccff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>
          ⚽
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '18px' }}>
            {equipo.name}
          </div>
          <div style={{ color: '#aaa', fontSize: '14px', marginTop: '4px' }}>
            {equipo.description || 'Equipo de fútbol'}
          </div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
            📍 {equipo.location || 'Ubicación desconocida'} • 👥 Max {equipo.max_players || 11}
          </div>
        </div>
      </div>
    </div>
  );

  const TorneoCard = ({ torneo }) => (
    <div
      onClick={() => navigate(`/torneo/${torneo.id}`)}
      style={{
        background: '#181818',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FFD700';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#333';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ff9500, #ff3366)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>
          🏆
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#ff9500', fontWeight: 'bold', fontSize: '18px' }}>
            {torneo.name}
          </div>
          <div style={{ color: '#aaa', fontSize: '14px', marginTop: '4px' }}>
            {torneo.type || 'Torneo'} • {new Date(torneo.start_date).toLocaleDateString()}
          </div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
            📍 {torneo.location || 'Ubicación desconocida'}
          </div>
        </div>
      </div>
    </div>
  );

  const totalResultados = resultados.jugadores.length + resultados.equipos.length + resultados.torneos.length;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 10000,
      overflow: 'auto',
      padding: '32px'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Header con Close */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '48px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🔍 Búsqueda Avanzada
          </h1>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#333',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Barra de búsqueda principal */}
        <div style={{
          background: '#181818',
          border: '2px solid #FFD700',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar jugadores, equipos, torneos..."
            style={{
              width: '100%',
              padding: '16px',
              background: '#0a0a0a',
              border: '1px solid #333',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '18px',
              marginBottom: '16px'
            }}
          />

          {/* Toggle Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: 'transparent',
              border: '1px solid #FFD700',
              color: '#FFD700',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showFilters ? '▲ Ocultar Filtros' : '▼ Mostrar Filtros'}
          </button>

          {/* Filtros */}
          {showFilters && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '16px'
            }}>
              <div>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Tipo
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                >
                  <option value="todos">Todos</option>
                  <option value="jugadores">Jugadores</option>
                  <option value="equipos">Equipos</option>
                  <option value="torneos">Torneos</option>
                </select>
              </div>

              <div>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Categoría
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                >
                  <option value="todos">Todas</option>
                  <option value="masculina">Masculina</option>
                  <option value="femenina">Femenina</option>
                  <option value="mixta">Mixta</option>
                  <option value="infantil_masculina">Infantil Masculina</option>
                  <option value="infantil_femenina">Infantil Femenina</option>
                </select>
              </div>

              <div>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Ubicación
                </label>
                <input
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Ciudad..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#FFD700' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</div>
            <div>Buscando...</div>
          </div>
        )}

        {/* Resultados */}
        {!loading && totalResultados > 0 && (
          <>
            {resultados.jugadores.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: '#FFD700', marginBottom: '16px' }}>
                  👥 Jugadores ({resultados.jugadores.length})
                </h2>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {resultados.jugadores.map(j => (
                    <JugadorCard key={j.id} jugador={j} />
                  ))}
                </div>
              </div>
            )}

            {resultados.equipos.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: '#00ff88', marginBottom: '16px' }}>
                  ⚽ Equipos ({resultados.equipos.length})
                </h2>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {resultados.equipos.map(e => (
                    <EquipoCard key={e.id} equipo={e} />
                  ))}
                </div>
              </div>
            )}

            {resultados.torneos.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: '#ff9500', marginBottom: '16px' }}>
                  🏆 Torneos ({resultados.torneos.length})
                </h2>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {resultados.torneos.map(t => (
                    <TorneoCard key={t.id} torneo={t} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Sin resultados */}
        {!loading && totalResultados === 0 && query.length >= 2 && (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#aaa'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '18px' }}>No se encontraron resultados</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              Intenta con otros términos de búsqueda
            </div>
          </div>
        )}

        {/* Estado inicial */}
        {!loading && totalResultados === 0 && query.length < 2 && !ubicacion && (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#aaa'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '18px' }}>Escribe para buscar</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              Encuentra jugadores, equipos y torneos
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
