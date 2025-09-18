// Removed duplicate EquiposPage definition and export
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EquipoEstadisticasPanel from '../components/EquipoEstadisticasPanel';
import '../components/EquipoEstadisticasPanel.css';

const equipoDemo = {
  nombre: 'Atlético Nacional',
  partidos: 42,
  victorias: 28,
  goles: 88,
  asistencias: 54,
  tarjetas: 12,
  mvp: 9,
  ranking: 2,
  logros: ['Campeón 2024', 'Fair Play', 'Mejor ataque']
};

const equiposDemo = [
  { id: 1, nombre: 'Atlético Nacional', categoria: 'A', miembros: 22 },
  { id: 2, nombre: 'River Plate', categoria: 'A', miembros: 20 },
  { id: 3, nombre: 'Barcelona', categoria: 'A', miembros: 23 }
];

const breadcrumbs = [
  { label: 'Inicio', path: '/' },
  { label: 'Ranking', path: '/ranking' },
  { label: 'Equipos', path: '/equipos' },
  { label: 'Torneos', path: '/torneos' },
  { label: 'Perfil', path: '/perfil' },
  { label: 'Programación', path: '/programacion' },
  // ...agrega más rutas si es necesario
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

const EquiposPage = () => {
  const [filtro, setFiltro] = useState('');
  const [equipos] = useState(equiposDemo);
  const [actividad] = useState([4, 2, 5, 1, 3]);
  const [msg, setMsg] = useState('');
  const agregar = () => alert('Agregar equipo');
  const editar = (id) => alert('Editar equipo ' + id);
  const eliminar = (id) => alert('Eliminar equipo ' + id);

  const equiposFiltrados = equipos.filter(e => e.nombre?.toLowerCase().includes(filtro.toLowerCase()));

  function handleConsultar() {
    setMsg('Consultando equipos...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleFiltrar() {
    setMsg('Filtrando equipos...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleVolver() {
    setMsg('Volviendo...');
    setTimeout(() => setMsg(''), 2000);
  }

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <BreadcrumbsNav />
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Estadísticas de Equipo</h2>
      <EquipoEstadisticasPanel equipo={equipoDemo} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, marginTop: 32 }}>
        <input type="text" placeholder="Buscar equipo..." value={filtro} onChange={e => setFiltro(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', width: '40%', fontSize: 18 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleConsultar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Consultar</button>
          <button onClick={handleFiltrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Filtrar</button>
          <button onClick={handleVolver} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Volver</button>
          <button onClick={agregar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Agregar equipo</button>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#232323', color: '#FFD700', borderRadius: 12, boxShadow: '0 2px 8px #FFD70022', fontSize: 18 }}>
        <thead>
          <tr style={{ background: '#FFD70022' }}>
            <th style={{ padding: 12 }}>Nombre</th>
            <th style={{ padding: 12 }}>Categoría</th>
            <th style={{ padding: 12 }}>Miembros</th>
            <th style={{ padding: 12 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {equiposFiltrados.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: 16, textAlign: 'center' }}>No hay equipos</td></tr>
          ) : (
            equiposFiltrados.map((equipo, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #FFD70044' }}>
                <td style={{ padding: 12 }}>{equipo.nombre}</td>
                <td style={{ padding: 12 }}>{equipo.categoria}</td>
                <td style={{ padding: 12 }}>{equipo.miembros}</td>
                <td style={{ padding: 12 }}>
                  <button onClick={() => editar(equipo.id)} style={{ marginRight: 8, background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => eliminar(equipo.id)} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
        <a href="/equipo-detalle" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', textDecoration: 'none' }}>Detalle de Equipo</a>
        <a href="/logros-equipo" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', textDecoration: 'none' }}>Logros del Equipo</a>
        <a href="/editar-equipo" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', textDecoration: 'none' }}>Editar Equipo</a>
      </div>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginTop: 32 }}>
        <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Gráfico de actividad de equipos</h3>
        <svg width="100%" height="120" viewBox="0 0 400 120">
          {actividad.map((val, i) => (
            <rect key={i} x={i * 70 + 20} y={120 - val * 20} width={40} height={val * 20} fill="#FFD700" rx={8} />
          ))}
          <line x1="20" y1="10" x2="20" y2="110" stroke="#FFD700" strokeWidth={2} />
          <line x1="20" y1="110" x2="380" y2="110" stroke="#FFD700" strokeWidth={2} />
        </svg>
      </div>
      {msg && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>{msg}</div>}
    </div>
  );
};

export default EquiposPage;
