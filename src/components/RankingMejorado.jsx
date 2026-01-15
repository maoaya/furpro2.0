import React, { useEffect, useState } from 'react';
import { getAvailableTournaments } from '../services/TournamentService';
import { supabase } from '../config/supabase';
import './RankingMejorado.css';

export function RankingMejorado() {
  const [rankings, setRankings] = useState([]);
  const [referees, setReferees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('equipos');
  
  // Filtros
  const [filters, setFilters] = useState({
    equipo: '',
    categoria: 'todas',
    minjuegos: 0,
    ranking: 'todos'
  });

  const [filteredRankings, setFilteredRankings] = useState([]);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      setLoading(true);
      // Obtener todos los rankings
      const data = await getAvailableTournaments();
      setRankings(data || []);
      
      // Obtener árbitros disponibles
      const { data: refData, error } = await supabase
        .from('referees')
        .select('*')
        .eq('is_available', true);
      
      setReferees(refData || []);
    } catch (error) {
      console.error('Error loading rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = rankings;

    // Filtro por nombre de equipo
    if (filters.equipo) {
      filtered = filtered.filter(r => 
        r.team_name?.toLowerCase().includes(filters.equipo.toLowerCase())
      );
    }

    // Filtro por categoría
    if (filters.categoria !== 'todas') {
      filtered = filtered.filter(r => r.category === filters.categoria);
    }

    // Filtro por mínimo de juegos
    if (filters.minjuegos > 0) {
      filtered = filtered.filter(r => (r.matches_played || 0) >= filters.minjuegos);
    }

    // Filtro por ranking
    if (filters.ranking !== 'todos') {
      if (filters.ranking === 'top10') {
        filtered = filtered.slice(0, 10);
      } else if (filters.ranking === 'mid') {
        filtered = filtered.slice(Math.floor(filtered.length / 4), Math.floor(filtered.length * 3 / 4));
      } else if (filters.ranking === 'bottom') {
        filtered = filtered.slice(-10);
      }
    }

    setFilteredRankings(filtered);
  }, [filters, rankings]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'minjuegos' ? parseInt(value) : value
    }));
  };

  if (loading) {
    return <div className="ranking-loading">⏳ Cargando rankings...</div>;
  }

  return (
    <div className="ranking-container">
      {/* Header */}
      <div className="ranking-header">
        <h1>🏆 Ranking de FutPro</h1>
        <p>Visualiza las estadísticas y posiciones de equipos y árbitros</p>
      </div>

      {/* Tabs */}
      <div className="ranking-tabs">
        <button
          className={`tab ${activeTab === 'equipos' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipos')}
        >
          ⚽ Equipos
        </button>
        <button
          className={`tab ${activeTab === 'arbitros' ? 'active' : ''}`}
          onClick={() => setActiveTab('arbitros')}
        >
          ⚖️ Árbitros
        </button>
      </div>

      {/* EQUIPOS TAB */}
      {activeTab === 'equipos' && (
        <>
          {/* Filtros */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Buscar Equipo</label>
              <input
                type="text"
                name="equipo"
                value={filters.equipo}
                onChange={handleFilterChange}
                placeholder="Ej: FutPro FC"
              />
            </div>

            <div className="filter-group">
              <label>Categoría</label>
              <select
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
              >
                <option value="todas">Todas las categorías</option>
                <option value="senior">Senior (18+)</option>
                <option value="sub21">Sub-21</option>
                <option value="sub18">Sub-18</option>
                <option value="sub16">Sub-16</option>
                <option value="master">Master (40+)</option>
                <option value="femenino">Femenino</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Mínimo de Juegos</label>
              <input
                type="number"
                name="minjuegos"
                value={filters.minjuegos}
                onChange={handleFilterChange}
                min="0"
                max="50"
              />
            </div>

            <div className="filter-group">
              <label>Rango de Ranking</label>
              <select
                name="ranking"
                value={filters.ranking}
                onChange={handleFilterChange}
              >
                <option value="todos">Todos</option>
                <option value="top10">Top 10</option>
                <option value="mid">Mitad</option>
                <option value="bottom">Últimos 10</option>
              </select>
            </div>

            <button className="btn-reset" onClick={() => setFilters({
              equipo: '',
              categoria: 'todas',
              minjuegos: 0,
              ranking: 'todos'
            })}>
              🔄 Limpiar Filtros
            </button>
          </div>

          {/* Ranking Table */}
          <div className="ranking-table-container">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th className="col-position">Pos.</th>
                  <th className="col-team">Equipo</th>
                  <th className="col-category">Categoría</th>
                  <th className="col-stats">PJ</th>
                  <th className="col-stats">G</th>
                  <th className="col-stats">E</th>
                  <th className="col-stats">P</th>
                  <th className="col-stats">GF</th>
                  <th className="col-stats">GC</th>
                  <th className="col-stats">DG</th>
                  <th className="col-points">Pts.</th>
                  <th className="col-trend">Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredRankings.length > 0 ? (
                  filteredRankings.map((ranking, idx) => (
                    <tr key={ranking.team_id} className={idx === 0 ? 'leader' : ''}>
                      <td className="col-position">
                        <span className="position-badge">{idx + 1}</span>
                      </td>
                      <td className="col-team">
                        <div className="team-info">
                          {ranking.team_logo && (
                            <img src={ranking.team_logo} alt={ranking.team_name} />
                          )}
                          <span>{ranking.team_name}</span>
                        </div>
                      </td>
                      <td className="col-category">{ranking.category}</td>
                      <td className="col-stats">{ranking.matches_played || 0}</td>
                      <td className="col-stats wins">{ranking.wins || 0}</td>
                      <td className="col-stats draws">{ranking.draws || 0}</td>
                      <td className="col-stats losses">{ranking.losses || 0}</td>
                      <td className="col-stats">{ranking.goals_for || 0}</td>
                      <td className="col-stats">{ranking.goals_against || 0}</td>
                      <td className="col-stats dg">
                        <span className={ranking.goal_difference >= 0 ? 'positive' : 'negative'}>
                          {ranking.goal_difference >= 0 ? '+' : ''}{ranking.goal_difference || 0}
                        </span>
                      </td>
                      <td className="col-points">
                        <strong>{ranking.total_points || 0}</strong>
                      </td>
                      <td className="col-trend">
                        {ranking.trend === 'up' && '📈'}
                        {ranking.trend === 'down' && '📉'}
                        {ranking.trend === 'stable' && '→'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="no-results">
                      No se encontraron resultados con los filtros seleccionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="ranking-legend">
            <div className="legend-item">
              <span className="legend-label">PJ:</span> Partidos Jugados
            </div>
            <div className="legend-item">
              <span className="legend-label">G:</span> Ganados
            </div>
            <div className="legend-item">
              <span className="legend-label">E:</span> Empatados
            </div>
            <div className="legend-item">
              <span className="legend-label">P:</span> Perdidos
            </div>
            <div className="legend-item">
              <span className="legend-label">GF:</span> Goles a Favor
            </div>
            <div className="legend-item">
              <span className="legend-label">GC:</span> Goles en Contra
            </div>
            <div className="legend-item">
              <span className="legend-label">DG:</span> Diferencia de Goles
            </div>
            <div className="legend-item">
              <span className="legend-label">Pts:</span> Puntos
            </div>
          </div>
        </>
      )}

      {/* ÁRBITROS TAB */}
      {activeTab === 'arbitros' && (
        <div className="referees-section">
          <h2>⚖️ Panel de Árbitros</h2>
          
          {referees.length > 0 ? (
            <div className="referees-grid">
              {referees.map(ref => (
                <div key={ref.id} className="referee-card">
                  <div className="referee-header">
                    {ref.avatar_url && (
                      <img src={ref.avatar_url} alt={ref.nombre} />
                    )}
                    <div className="referee-info">
                      <h3>{ref.nombre} {ref.apellido}</h3>
                      <p className="certification">{ref.certificationLevel || 'Sin certificación'}</p>
                    </div>
                  </div>

                  <div className="referee-stats">
                    <div className="stat">
                      <span className="label">Partidos Arbitrados</span>
                      <span className="value">{ref.matches_assigned || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Disponibilidad</span>
                      <span className={`value ${ref.is_available ? 'available' : 'unavailable'}`}>
                        {ref.is_available ? '✅ Disponible' : '❌ No disponible'}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="label">Calificación</span>
                      <span className="value stars">
                        {'⭐'.repeat(ref.rating || 0)}
                      </span>
                    </div>
                  </div>

                  <button className="btn-view-profile">Ver Perfil</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-referees">
              <p>No hay árbitros disponibles en este momento</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RankingMejorado;
