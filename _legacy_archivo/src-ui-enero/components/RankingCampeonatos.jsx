import React, { useState, useEffect } from 'react';

// Resolver API_URL en tiempo de ejecución (no al cargar el módulo)
const getApiUrl = () =>
  (typeof process !== 'undefined' && process.env && (process.env.VITE_API_URL || process.env.API_URL)) ||
  (typeof window !== 'undefined' && window.__API_URL__) ||
  'https://futpro.vip/api';

export default function RankingCampeonatos() {
  const [campeonatos, setCampeonatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    estado: '',
    fechaInicioDesde: '',
    fechaInicioHasta: '',
    limite: 20
  });

  const cargarRanking = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    try {
      const res = await fetch(`${getApiUrl()}/ranking/campeonatos?${params}`);
      const data = await res.json();
      
      if (data.status === 'ok') {
        setCampeonatos(data.ranking);
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

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const getEstadoBadge = (estado) => {
    const colores = {
      activo: '#28a745',
      finalizado: '#6c757d',
      programado: '#007bff',
      cancelado: '#dc3545'
    };
    
    return {
      background: colores[estado] || '#6c757d',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px'
    };
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
        <h2 style={{ margin: 0 }}>🏆 Ranking de Campeonatos</h2>
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
          placeholder="Categoría (Liga Profesional, Copa, etc.)"
          value={filtros.categoria}
          onChange={e => handleFiltroChange('categoria', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select
          value={filtros.estado}
          onChange={e => handleFiltroChange('estado', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="programado">Programado</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <input
          type="date"
          placeholder="Fecha inicio desde"
          value={filtros.fechaInicioDesde}
          onChange={e => handleFiltroChange('fechaInicioDesde', e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="date"
          placeholder="Fecha inicio hasta"
          value={filtros.fechaInicioHasta}
          onChange={e => handleFiltroChange('fechaInicioHasta', e.target.value)}
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

      {/* Cards de campeonatos */}
      {!loading && !error && campeonatos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {campeonatos.map((campeonato, index) => (
            <div key={campeonato.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #eee'
            }}>
              {/* Header con posición y estado */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{
                  background: '#007bff',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {index + 1}
                </div>
                <span style={getEstadoBadge(campeonato.estado)}>
                  {campeonato.estado}
                </span>
              </div>

              {/* Nombre del campeonato */}
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{campeonato.nombre}</h3>
              
              {/* Información básica */}
              <div style={{ marginBottom: '15px', color: '#666' }}>
                <p style={{ margin: '5px 0' }}><strong>Categoría:</strong> {campeonato.categoria}</p>
                <p style={{ margin: '5px 0' }}><strong>Fecha inicio:</strong> {formatearFecha(campeonato.fecha_inicio)}</p>
                {campeonato.fecha_fin && (
                  <p style={{ margin: '5px 0' }}><strong>Fecha fin:</strong> {formatearFecha(campeonato.fecha_fin)}</p>
                )}
              </div>

              {/* Estadísticas */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '10px',
                marginBottom: '15px'
              }}>
                <div style={{ textAlign: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                    {campeonato.total_equipos || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Equipos</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                    {campeonato.total_partidos || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Partidos</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                    {campeonato.total_visualizaciones || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Views</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                    {parseFloat(campeonato.ranking).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Ranking</div>
                </div>
              </div>

              {/* Barra de progreso del ranking */}
              <div style={{ width: '100%', background: '#e9ecef', borderRadius: '10px', height: '8px' }}>
                <div style={{
                  width: `${Math.min((campeonato.ranking / 100) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #007bff, #28a745)',
                  height: '100%',
                  borderRadius: '10px'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && campeonatos.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666' }}>No se encontraron campeonatos con los filtros aplicados.</div>
      )}
    </div>
  );
}