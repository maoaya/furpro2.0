import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RankingEquiposCompleto() {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [filteredEquipos, setFilteredEquipos] = useState([]);
  const [categoria, setCategoria] = useState('todos');

  useEffect(() => {
    loadRanking();
  }, []);

  useEffect(() => {
    filterEquipos();
  }, [equipos, categoria]);

  const loadRanking = () => {
    // Stub: Datos de ejemplo (50 equipos)
    const equiposData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      posicion: i + 1,
      nombre: `Equipo ${i + 1}`,
      escudo: i % 4 === 0 ? '🦁' : i % 4 === 1 ? '⚡' : i % 4 === 2 ? '🔥' : '⭐',
      puntos: 90 - i * 2,
      pj: 30, // Partidos jugados
      pg: 25 - Math.floor(i / 2), // Partidos ganados
      pe: Math.floor(Math.random() * 5), // Partidos empatados
      pp: Math.floor(Math.random() * 5), // Partidos perdidos
      gf: 75 - i * 2, // Goles a favor
      gc: 25 + i, // Goles en contra
      dif: 50 - i * 3, // Diferencia de goles
      categoria: ['masculina', 'femenina', 'infantil_masculina', 'infantil_femenina'][i % 4],
      miembros: Math.floor(Math.random() * 20) + 11
    }));

    setEquipos(equiposData);
  };

  const filterEquipos = () => {
    let result = [...equipos];

    if (categoria !== 'todos') {
      result = result.filter(e => e.categoria === categoria);
    }

    // Reordenar posiciones después del filtro
    result = result.map((e, index) => ({
      ...e,
      posicion: index + 1
    }));

    setFilteredEquipos(result);
  };

  const handleViewEquipo = (equipoId) => {
    navigate(`/equipo/${equipoId}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 Ranking de Equipos</h1>
        <p style={styles.subtitle}>Tabla de clasificación general</p>
      </div>

      {/* Filtros */}
      <div style={styles.filters}>
        <select 
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          style={styles.select}
        >
          <option value="todos">Todas las categorías</option>
          <option value="masculina">Masculina</option>
          <option value="femenina">Femenina</option>
          <option value="infantil_masculina">Infantil Masculina</option>
          <option value="infantil_femenina">Infantil Femenina</option>
        </select>
      </div>

      {/* Tabla */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Pos</th>
              <th style={{...styles.th, textAlign: 'left'}}>Equipo</th>
              <th style={styles.th}>PTS</th>
              <th style={styles.th}>PJ</th>
              <th style={styles.th}>PG</th>
              <th style={styles.th}>PE</th>
              <th style={styles.th}>PP</th>
              <th style={styles.th}>GF</th>
              <th style={styles.th}>GC</th>
              <th style={styles.th}>DIF</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipos.map((equipo, index) => (
              <tr
                key={equipo.id}
                style={{
                  ...styles.tr,
                  ...(index < 3 ? styles.trTop3 : {}),
                  ...(index >= filteredEquipos.length - 3 ? styles.trBottom3 : {})
                }}
                onClick={() => handleViewEquipo(equipo.id)}
              >
                <td style={styles.td}>
                  <div style={styles.posicionCell}>
                    {index === 0 && <span style={styles.medalIcon}>🥇</span>}
                    {index === 1 && <span style={styles.medalIcon}>🥈</span>}
                    {index === 2 && <span style={styles.medalIcon}>🥉</span>}
                    {index > 2 && equipo.posicion}
                  </div>
                </td>
                <td style={{...styles.td, display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={styles.escudo}>{equipo.escudo}</div>
                  <div>
                    <div style={styles.nombre}>{equipo.nombre}</div>
                    <div style={styles.categoriaLabel}>
                      {equipo.miembros} miembros
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <strong style={styles.puntos}>{equipo.puntos}</strong>
                </td>
                <td style={styles.td}>{equipo.pj}</td>
                <td style={styles.td}>
                  <span style={styles.statGreen}>{equipo.pg}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.statYellow}>{equipo.pe}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.statRed}>{equipo.pp}</span>
                </td>
                <td style={styles.td}>{equipo.gf}</td>
                <td style={styles.td}>{equipo.gc}</td>
                <td style={styles.td}>
                  <span style={equipo.dif >= 0 ? styles.difPositiva : styles.difNegativa}>
                    {equipo.dif >= 0 ? '+' : ''}{equipo.dif}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={styles.legendColor} />
          <span>Top 3 (Clasifican a Copa)</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, background: '#8B0000'}} />
          <span>Bottom 3 (Zona de descenso)</span>
        </div>
      </div>

      {filteredEquipos.length === 0 && (
        <div style={styles.empty}>
          <p>No se encontraron equipos en esta categoría</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    paddingBottom: 80
  },
  header: {
    padding: 24,
    background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
    borderBottom: '2px solid #FFD700',
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa'
  },
  filters: {
    padding: 16,
    background: '#1a1a1a',
    borderBottom: '1px solid #333'
  },
  select: {
    width: '100%',
    padding: 12,
    background: '#2a2a2a',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13
  },
  thead: {
    background: '#1a1a1a',
    position: 'sticky',
    top: 0,
    zIndex: 5
  },
  th: {
    padding: 12,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#aaa',
    borderBottom: '2px solid #333',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #2a2a2a',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  trTop3: {
    background: 'rgba(34, 139, 34, 0.1)',
    borderLeft: '3px solid #228B22'
  },
  trBottom3: {
    background: 'rgba(139, 0, 0, 0.1)',
    borderLeft: '3px solid #8B0000'
  },
  td: {
    padding: 12,
    textAlign: 'center',
    fontSize: 13,
    color: '#fff'
  },
  posicionCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  medalIcon: {
    fontSize: 20
  },
  escudo: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20
  },
  nombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left'
  },
  categoriaLabel: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'left'
  },
  puntos: {
    fontSize: 16,
    color: '#FFD700'
  },
  statGreen: {
    color: '#4CAF50'
  },
  statYellow: {
    color: '#FFC107'
  },
  statRed: {
    color: '#F44336'
  },
  difPositiva: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  difNegativa: {
    color: '#F44336',
    fontWeight: 'bold'
  },
  legend: {
    padding: 16,
    background: '#1a1a1a',
    borderTop: '1px solid #333',
    display: 'flex',
    gap: 16,
    fontSize: 12
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#aaa'
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
    background: '#228B22'
  },
  empty: {
    textAlign: 'center',
    padding: 64,
    color: '#aaa'
  }
};
