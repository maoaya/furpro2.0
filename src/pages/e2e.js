import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#222';

const E2EPage = () => {
  const [filtro, setFiltro] = useState('');
  // Estado de tests no utilizado en este mock
  const [actividad] = useState([4, 2, 5, 1, 3]);
  const [msg, setMsg] = useState('');
  const ejecutar = () => setMsg('Ejecutando test E2E...');
  const consultar = () => setMsg('Consultando tests...');
  const actualizar = () => setMsg('Actualizando tests...');

  // No se utiliza lista filtrada en este mock

  return (
    <div style={{ display: 'flex', background: black, minHeight: '100vh', color: gold, padding: 32 }}>
      {/* Panel lateral tipo Facebook */}
      <aside style={{ width: 220, background: '#232323', padding: 32, borderRight: `2px solid ${gold}`, minHeight: '100vh' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 32 }}>Menú E2E</h3>
        <ul style={{ listStyle: 'none', padding: 0, color: gold }}>
          <li style={{ marginBottom: 18 }}><button style={{ background: 'none', color: gold, border: 'none', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Ejecutar</button></li>
          <li style={{ marginBottom: 18 }}><button style={{ background: 'none', color: gold, border: 'none', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Consultar</button></li>
        </ul>
      </aside>
      {/* Feed central tipo Facebook */}
      <main style={{ flex: 1, padding: 48, maxWidth: 800, margin: 'auto' }}>
        <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Dashboard E2E - Feed</h2>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <input type="text" placeholder="Filtrar por nombre..." value={filtro} onChange={e => setFiltro(e.target.value)} style={{ padding: 8, borderRadius: 8, border: `1px solid ${gold}`, background: '#232323', color: gold, width: '40%' }} />
          <button onClick={ejecutar} style={{ background: gold, color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', boxShadow: `0 2px 8px ${gold}88`, cursor: 'pointer' }}>Ejecutar</button>
          <button onClick={consultar} style={{ background: '#232323', color: gold, border: `1px solid ${gold}`, borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>Consultar</button>
          <button onClick={actualizar} style={{ background: '#232323', color: gold, border: `1px solid ${gold}`, borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>Actualizar</button>
        </div>
        {/* Feed de tests */}
        <section style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32, boxShadow: `0 2px 12px ${gold}22` }}>
          <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Actividad reciente de tests E2E</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: 18, color: gold }}>Test ejecutado: principal</li>
            <li style={{ marginBottom: 18, color: gold }}>Test consultado: FutPro Stars</li>
          </ul>
        </section>
        {/* Gráfico de actividad */}
        <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32 }}>
          <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Gráfico de actividad de Tests E2E</h3>
          <svg width="100%" height="120" viewBox="0 0 400 120">
            {actividad.map((val, i) => (
              <rect key={i} x={i * 70 + 20} y={120 - val * 20} width={40} height={val * 20} fill={gold} rx={8} />
            ))}
            <line x1="20" y1="10" x2="20" y2="110" stroke={gold} strokeWidth={2} />
            <line x1="20" y1="110" x2="380" y2="110" stroke={gold} strokeWidth={2} />
          </svg>
        </div>
        {msg && <div style={{ marginTop: 24, background: '#232323', color: gold, padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: `0 2px 8px ${gold}22` }}>{msg}</div>}
      </main>
      {/* Panel lateral derecho (opcional) */}
      <aside style={{ width: 220, background: '#232323', padding: 32, borderLeft: `2px solid ${gold}`, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 32 }}>Acciones rápidas</h3>
        <button style={{ background: gold, color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, marginBottom: 18, boxShadow: `0 2px 8px ${gold}88`, cursor: 'pointer' }}>Ejecutar test</button>
        <button style={{ background: '#232323', color: gold, border: `1px solid ${gold}`, borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, marginBottom: 18, cursor: 'pointer' }}>Consultar historial</button>
      </aside>
    </div>
  );
};

export default E2EPage;