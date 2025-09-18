import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import { Line } from 'react-chartjs-2';

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

export default function ProgramacionPartidosPage() {
  const [partidos, setPartidos] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10));
  const [organizador, setOrganizador] = useState('');
  const [organizadores, setOrganizadores] = useState([]);

  useEffect(() => {
    async function cargarOrganizadores() {
      const { data } = await supabase.from('organizadores').select('nombre');
      setOrganizadores(data || []);
    }
    cargarOrganizadores();
  }, []);

  useEffect(() => {
    async function cargarPartidos() {
      let query = supabase.from('partidos').select('*').eq('fecha', fecha);
      if (organizador) query = query.eq('organizador', organizador);
      const { data } = await query;
      setPartidos(data || []);
    }
    cargarPartidos();
  }, [fecha, organizador]);

  const chartData = {
    labels: partidos.map(p => p.hora),
    datasets: [{
      label: 'Partidos del Día',
      data: partidos.map(p => p.importancia || 1),
      backgroundColor: '#FFD700',
      borderColor: '#FFD700',
      fill: false,
    }],
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <BreadcrumbsNav />
      <nav style={{ marginBottom: 18 }}>
        <Link to="/" style={{ color: '#FFD700', fontWeight: 'bold', marginRight: 12 }}>Inicio</Link>
        <span style={{ color: '#FFD700' }}> / </span>
        <Link to="/programacion-partidos" style={{ color: '#FFD700', fontWeight: 'bold', marginRight: 12 }}>Programación Partidos</Link>
        <span style={{ color: '#FFD700' }}> / </span>
        <Link to="/ranking-jugadores" style={{ color: '#FFD700', marginRight: 12 }}>Ranking Jugadores</Link>
        <span style={{ color: '#FFD700' }}> / </span>
        <Link to="/ranking-equipos" style={{ color: '#FFD700' }}>Ranking Equipos</Link>
      </nav>
      <h2>Programación de Partidos</h2>
      <div style={{ marginBottom: 18 }}>
        <label>Fecha: <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ borderRadius: 8, padding: 8 }} /></label>
        <label style={{ marginLeft: 18 }}>Organizador: <select value={organizador} onChange={e => setOrganizador(e.target.value)} style={{ borderRadius: 8, padding: 8 }}>
          <option value="">Todos</option>
          {organizadores.map(o => <option key={o.nombre} value={o.nombre}>{o.nombre}</option>)}
        </select></label>
      </div>
      <Line data={chartData} options={{ plugins: { legend: { display: false } } }} />
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 24 }}>
        {partidos.map(p => (
          <li key={p.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <h3>{p.equipo_local} vs {p.equipo_visitante}</h3>
            <div>Hora: {p.hora}</div>
            <div>Organizador: {p.organizador}</div>
            <div>Importancia: {p.importancia || 'Normal'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
