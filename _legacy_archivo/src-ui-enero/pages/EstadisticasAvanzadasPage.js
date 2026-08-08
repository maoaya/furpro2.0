import React, { useState } from 'react';
import ComparativasPanel from '../components/ComparativasPanel';
import '../components/ComparativasPanel.css';

const jugadoresDemo = [
  { nombre: 'Juan Pérez', partidos: 30, goles: 24, asistencias: 12, victorias: 18, mvp: 5, tarjetas: 3, faltas: 7, puntos: 240 },
  { nombre: 'Ana Gómez', partidos: 28, goles: 2, asistencias: 8, victorias: 14, mvp: 2, tarjetas: 1, faltas: 3, puntos: 80 },
  { nombre: 'Carlos Ruiz', partidos: 32, goles: 5, asistencias: 10, victorias: 20, mvp: 3, tarjetas: 2, faltas: 5, puntos: 120 },
];
const equiposDemo = [
  { nombre: 'Atlético Nacional', partidos: 42, victorias: 28, goles: 88, ranking: 2, asistencias: 40, tarjetas: 8, faltas: 22 },
  { nombre: 'River Plate', partidos: 40, victorias: 25, goles: 80, ranking: 3, asistencias: 35, tarjetas: 6, faltas: 18 },
  { nombre: 'Barcelona', partidos: 45, victorias: 32, goles: 95, ranking: 1, asistencias: 50, tarjetas: 5, faltas: 15 },
];

export default function EstadisticasAvanzadasPage() {
  const [filtro, setFiltro] = useState('');
  const [actividad] = useState([1, 3, 5, 2, 4]);
  const [msg, setMsg] = useState('');

  const exportar = () => alert('Exportar estadísticas');
  const comparar = () => alert('Comparar estadísticas');
  function handleConsultar() {
    setMsg('Consultando estadísticas avanzadas...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleFiltrar() {
    setMsg('Filtrando estadísticas...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleVolver() {
    setMsg('Volviendo...');
    setTimeout(() => setMsg(''), 2000);
  }

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Estadísticas Avanzadas</h2>
      <div style={{ marginBottom: 24 }}>
        <input type="text" placeholder="Filtrar por equipo/jugador/torneo..." value={filtro} onChange={e => setFiltro(e.target.value)} style={{ padding: 12, width: '60%', borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', fontSize: 18 }} />
        <button onClick={exportar} style={{ marginLeft: 12, background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Exportar</button>
        <button onClick={comparar} style={{ marginLeft: 12, background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Comparar</button>
      </div>
      <div style={{ background: '#232323', border: '1px solid #FFD700', padding: 32, borderRadius: 12, marginBottom: 32 }}>
        <ComparativasPanel jugadores={jugadoresDemo} equipos={equiposDemo} filtro={filtro} />
      </div>
      <div style={{ background: '#232323', borderRadius: 8, padding: 24, color: '#FFD700', boxShadow: '0 2px 8px #FFD70022' }}>
        <p style={{ color: '#FFD700', fontSize: 18 }}>Aquí se mostrarán los gráficos y tablas de estadísticas avanzadas.</p>
      </div>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32 }}>
        <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Gráfico de actividad avanzada</h3>
        <svg width="100%" height="120" viewBox="0 0 400 120">
          {actividad.map((val, i) => (
            <rect key={i} x={i * 70 + 20} y={120 - val * 20} width={40} height={val * 20} fill="#FFD700" rx={8} />
          ))}
          <line x1="20" y1="10" x2="20" y2="110" stroke="#FFD700" strokeWidth={2} />
          <line x1="20" y1="110" x2="380" y2="110" stroke="#FFD700" strokeWidth={2} />
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button onClick={handleConsultar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Consultar</button>
        <button onClick={handleFiltrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Filtrar</button>
        <button onClick={handleVolver} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Volver</button>
      </div>
      {msg && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>{msg}</div>}
    </div>
  );
}
