import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import { Bar } from 'react-chartjs-2';

const breadcrumbs = [
  { label: 'Inicio', path: '/' },
  { label: 'Ranking Jugadores', path: '/ranking-jugadores' },
  { label: 'Ranking Equipos', path: '/ranking-equipos' },
  { label: 'Programación', path: '/programacion' },
  { label: 'Perfil', path: '/perfil' },
  { label: 'Torneos', path: '/torneos' },
];

function BreadcrumbsNav() {
  return (
    <nav className="breadcrumbs-nav" style={{ margin: '16px 0', fontSize: '1rem' }}>
      {breadcrumbs.map((crumb, idx) => (
        <span key={crumb.path}>
          <Link to={crumb.path} style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold' }}>{crumb.label}</Link>
          {idx < breadcrumbs.length - 1 && <span style={{ color: '#222', margin: '0 8px' }}>/</span>}
        </span>
      ))}
    </nav>
  );
}

export default function RankingEquiposPage() {
  const [ranking, setRanking] = useState([]);
  const [categoria, setCategoria] = useState('sub12');
  const categorias = ['sub12','sub13','sub14','sub15','sub16','sub17','sub18','sub20','mayores'];

  useEffect(() => {
    async function cargarRanking() {
      const { data, error } = await supabase.from('equipos').select('*').eq('categoria', categoria);
      if (!error && data) {
        const rankingArr = data.map(e => ({
          id: e.id,
          nombre: e.nombre,
          valoracion: e.valoracion || 0,
          estadisticas: e.estadisticas || {},
        })).sort((a,b) => b.valoracion - a.valoracion);
        setRanking(rankingArr);
      }
    }
    cargarRanking();
  }, [categoria]);

  const chartData = {
    labels: ranking.map(e => e.nombre),
    datasets: [{
      label: 'Valoración',
      data: ranking.map(e => e.valoracion),
      backgroundColor: '#FFD700',
    }],
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <BreadcrumbsNav />
      <h2>Ranking de Equipos por Categoría</h2>
      <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ borderRadius: 8, padding: 8, marginBottom: 18 }}>
        {categorias.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
      </select>
      <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 24 }}>
        {ranking.map(e => (
          <li key={e.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <h3>{e.nombre}</h3>
            <div>Valoración: {e.valoracion}</div>
            <div>Estadísticas: {JSON.stringify(e.estadisticas)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
