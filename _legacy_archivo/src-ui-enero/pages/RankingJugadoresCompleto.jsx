import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function RankingJugadoresCompleto() {
  const navigate = useNavigate();
  const [jugadores, setJugadores] = useState([]);
  const [filteredJugadores, setFilteredJugadores] = useState([]);
  const [categoria, setCategoria] = useState('todos');
  const [ordenarPor, setOrdenarPor] = useState('ovr');
  const [currentUser, setCurrentUser] = useState(null);
  const [myPosition, setMyPosition] = useState(null);

  useEffect(() => {
    loadCurrentUser();
    loadRanking();
  }, []);

  useEffect(() => {
    filterAndSortJugadores();
  }, [jugadores, categoria, ordenarPor]);

  const loadCurrentUser = async () => {
    const { data } = await supabase.auth.getSession();
    setCurrentUser(data?.session?.user);
  };

  const loadRanking = () => {
    // Stub: Datos de ejemplo (100 jugadores)
    const jugadoresData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      posicion: i + 1,
      nombre: `Jugador ${i + 1}`,
      avatar: i % 5 === 0 ? '⭐' : '👤',
      ovr: 90 - Math.floor(i / 5),
      goles: Math.floor(Math.random() * 50) + 5,
      asistencias: Math.floor(Math.random() * 30) + 2,
      partidos: Math.floor(Math.random() * 40) + 10,
      categoria: ['masculina', 'femenina', 'infantil_masculina', 'infantil_femenina'][i % 4],
      isCurrentUser: i === 44 // Simular que el usuario actual está en posición 45
    }));

    setJugadores(jugadoresData);

    // Encontrar posición del usuario actual
    const userPos = jugadoresData.findIndex(j => j.isCurrentUser);
    if (userPos !== -1) {
      setMyPosition(userPos + 1);
    }
  };

  const filterAndSortJugadores = () => {
    let result = [...jugadores];

    // Filtrar por categoría
    if (categoria !== 'todos') {
      result = result.filter(j => j.categoria === categoria);
    }

    // Ordenar
    result.sort((a, b) => {
      if (ordenarPor === 'ovr') return b.ovr - a.ovr;
      if (ordenarPor === 'goles') return b.goles - a.goles;
      if (ordenarPor === 'asistencias') return b.asistencias - a.asistencias;
      if (ordenarPor === 'partidos') return b.partidos - a.partidos;
      return 0;
    });

    // Reordenar posiciones
    result = result.map((j, index) => ({
      ...j,
      posicion: index + 1
    }));

    setFilteredJugadores(result);
  };

  const handleViewProfile = (jugadorId) => {
    navigate(`/perfil/${jugadorId}`);
  };

  const scrollToMyPosition = () => {
    if (myPosition) {
      const element = document.getElementById(`player-${myPosition}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 Ranking de Jugadores</h1>
        {myPosition && (
          <button 
            style={styles.myPositionBtn}
            onClick={scrollToMyPosition}
          >
            Tu posición: #{myPosition}
          </button>
        )}
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

        <select 
          value={ordenarPor}
          onChange={e => setOrdenarPor(e.target.value)}
          style={styles.select}
        >
          <option value="ovr">Ordenar por OVR</option>
          <option value="goles">Ordenar por Goles</option>
          <option value="asistencias">Ordenar por Asistencias</option>
          <option value="partidos">Ordenar por Partidos</option>
        </select>
      </div>

      {/* Tabla */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Pos</th>
              <th style={{...styles.th, textAlign: 'left'}}>Jugador</th>
              <th style={styles.th}>OVR</th>
              <th style={styles.th}>Goles</th>
              <th style={styles.th}>Asist.</th>
              <th style={styles.th}>PJ</th>
            </tr>
          </thead>
          <tbody>
            {filteredJugadores.map((jugador, index) => (
              <tr
                key={jugador.id}
                id={`player-${jugador.posicion}`}
                style={{
                  ...styles.tr,
                  ...(jugador.isCurrentUser ? styles.trHighlight : {}),
                  ...(index < 3 ? styles.trTop3 : {})
                }}
                onClick={() => handleViewProfile(jugador.id)}
              >
                <td style={styles.td}>
                  {jugador.posicion === 1 && '🥇'}
                  {jugador.posicion === 2 && '🥈'}
                  {jugador.posicion === 3 && '🥉'}
                  {jugador.posicion > 3 && jugador.posicion}
                </td>
                <td style={{...styles.td, display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={styles.avatar}>{jugador.avatar}</div>
                  <div>
                    <div style={styles.nombre}>{jugador.nombre}</div>
                    <div style={styles.categoriaLabel}>
                      {jugador.categoria.replace('_', ' ')}
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.ovrBadge}>{jugador.ovr}</span>
                </td>
                <td style={styles.td}>{jugador.goles}</td>
                <td style={styles.td}>{jugador.asistencias}</td>
                <td style={styles.td}>{jugador.partidos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredJugadores.length === 0 && (
        <div style={styles.empty}>
          <p>No se encontraron jugadores en esta categoría</p>
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
    borderBottom: '2px solid #FFD700'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
    textAlign: 'center'
  },
  myPositionBtn: {
    width: '100%',
    padding: 12,
    background: 'rgba(255, 215, 0, 0.1)',
    border: '1px solid #FFD700',
    borderRadius: 8,
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  filters: {
    padding: 16,
    display: 'flex',
    gap: 8,
    background: '#1a1a1a',
    borderBottom: '1px solid #333'
  },
  select: {
    flex: 1,
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
    borderCollapse: 'collapse'
  },
  thead: {
    background: '#1a1a1a',
    position: 'sticky',
    top: 0,
    zIndex: 5
  },
  th: {
    padding: 16,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#aaa',
    borderBottom: '2px solid #333'
  },
  tr: {
    borderBottom: '1px solid #2a2a2a',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  trHighlight: {
    background: 'rgba(255, 215, 0, 0.1)',
    borderLeft: '3px solid #FFD700'
  },
  trTop3: {
    background: 'rgba(255, 215, 0, 0.05)'
  },
  td: {
    padding: 16,
    textAlign: 'center',
    fontSize: 14,
    color: '#fff'
  },
  avatar: {
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
    textTransform: 'capitalize',
    textAlign: 'left'
  },
  ovrBadge: {
    padding: '4px 12px',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    borderRadius: 16,
    color: '#0a0a0a',
    fontSize: 14,
    fontWeight: 'bold'
  },
  empty: {
    textAlign: 'center',
    padding: 64,
    color: '#aaa'
  }
};
