import React, { useState, useEffect } from 'react';

// Resolver API_URL en tiempo de ejecución (no al cargar el módulo)
const getApiUrl = () =>
  (typeof process !== 'undefined' && process.env && (process.env.VITE_API_URL || process.env.API_URL)) ||
  (typeof window !== 'undefined' && window.__API_URL__) ||
  'https://futpro.vip/api';

export default function RankingJugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    edadMin: '',
    edadMax: '',
    equipoId: '',
    limite: 20
  });

  const cargarRanking = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    try {
      const res = await fetch(`${getApiUrl()}/ranking/jugadores?${params}`);
      const data = await res.json();
      
      if (data.status === 'ok') {
        setJugadores(data.ranking);
        setError('');
      } else {
        setError(data.error || 'Error al cargar ranking');
      }
    } catch (err) {
      setError('No se pudo conectar al backend');
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarRanking();
  }, []);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header con logo */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img 
          src="/images/futpro-logo.png" 
          alt="FutPro Logo" 
          style={{ 
            width: 60, 
            height: 60, 
            borderRadius: 8,
            marginBottom: 15,
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
          }} 
        />
        <h2 style={{ margin: 0 }}>🏆 Ranking de Jugadores</h2>
      </div>
      
      {/* Filtros */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px', 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Categoría (sub20, profesional, etc.)"
          value={filtros.categoria}
          onChange={e => handleFiltroChange('categoria', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Edad mínima"
          value={filtros.edadMin}
          onChange={e => handleFiltroChange('edadMin', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Edad máxima"
          value={filtros.edadMax}
          onChange={e => handleFiltroChange('edadMax', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="ID del equipo"
          value={filtros.equipoId}
          onChange={e => handleFiltroChange('equipoId', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Límite de resultados"
          value={filtros.limite}
          onChange={e => handleFiltroChange('limite', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={cargarRanking}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Filtrar
        </button>
      </div>

      {/* Loading/Error */}
      {loading && <div style={{ textAlign: 'center' }}>Cargando ranking...</div>}
      {error && <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>}

      {/* Tabla de ranking */}
      {!loading && !error && jugadores.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#007bff', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Posición</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Equipo</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Edad</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Goles</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Asistencias</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Partidos</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Ranking</th>
              </tr>
            </thead>
            <tbody>
              {jugadores.map((jugador, index) => (
                <tr key={jugador.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{index + 1}</td>
                  <td style={{ padding: '12px' }}>{jugador.nombre}</td>
                  <td style={{ padding: '12px' }}>{jugador.equipo_nombre || 'Sin equipo'}</td>
                  <td style={{ padding: '12px' }}>{jugador.edad}</td>
                  <td style={{ padding: '12px' }}>{jugador.goles || 0}</td>
                  <td style={{ padding: '12px' }}>{jugador.asistencias || 0}</td>
                  <td style={{ padding: '12px' }}>{jugador.partidos_jugados || 0}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#007bff' }}>{jugador.ranking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && jugadores.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666' }}>No se encontraron jugadores con los filtros aplicados.</div>
      )}
    </div>
  );
}