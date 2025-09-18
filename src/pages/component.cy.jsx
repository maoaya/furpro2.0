import React, { useState } from 'react';

const ComponentCyPage = () => {
  const [filtro, setFiltro] = useState('');
  const [actividad] = useState([3, 1, 4, 2, 5]);
  const [msg, setMsg] = useState('');
  const consultar = () => setMsg('Consultando componentes...');
  const actualizar = () => setMsg('Actualizando componentes...');
  const verHistorial = () => setMsg('Viendo historial...');

  return (
    <div style={{ display: 'flex', background: '#181818', minHeight: '100vh', color: '#FFD700' }}>
      {/* Panel lateral tipo Facebook */}
      <aside style={{ width: 220, background: '#232323', padding: 32, borderRight: '2px solid #FFD700', minHeight: '100vh' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 32 }}>Menú Componentes</h3>
        <ul style={{ listStyle: 'none', padding: 0, color: '#FFD700' }}>
          <li style={{ marginBottom: 18 }}><button style={{ background: 'none', color: '#FFD700', border: 'none', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Consultar</button></li>
          <li style={{ marginBottom: 18 }}><button style={{ background: 'none', color: '#FFD700', border: 'none', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Historial</button></li>
        </ul>
      </aside>
      {/* Feed central tipo Facebook */}
      <main style={{ flex: 1, padding: 48, maxWidth: 800, margin: 'auto' }}>
        <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Dashboard de Componentes - Feed</h2>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <input type="text" placeholder="Filtrar por nombre..." value={filtro} onChange={e => setFiltro(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', width: '40%' }} />
          <button onClick={consultar} style={{ background: '#FFD700', color: '#232323', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Consultar</button>
          <button onClick={actualizar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>Actualizar</button>
          <button onClick={verHistorial} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>Ver historial</button>
        </div>
        {/* Feed de componentes */}
        <section style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32, boxShadow: '0 2px 12px #FFD70022' }}>
          <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Actividad reciente de componentes</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: 18, color: '#FFD700' }}>Componente consultado: principal</li>
            <li style={{ marginBottom: 18, color: '#FFD700' }}>Historial consultado: FutPro Stars</li>
          </ul>
        </section>
        {/* Gráfico de actividad */}
        <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32 }}>
          <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Gráfico de actividad de Componentes</h3>
          <svg width="100%" height="120" viewBox="0 0 400 120">
            {actividad.map((val, i) => (
              <rect key={i} x={i * 70 + 20} y={120 - val * 20} width={40} height={val * 20} fill="#FFD700" rx={8} />
            ))}
            <line x1="20" y1="10" x2="20" y2="110" stroke="#FFD700" strokeWidth={2} />
            <line x1="20" y1="110" x2="380" y2="110" stroke="#FFD700" strokeWidth={2} />
          </svg>
        </div>
        {msg && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>{msg}</div>}
      </main>
      {/* Panel lateral derecho (opcional) */}
      <aside style={{ width: 220, background: '#232323', padding: 32, borderLeft: '2px solid #FFD700', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 32 }}>Acciones rápidas</h3>
        <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, marginBottom: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Consultar componente</button>
        <button style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, marginBottom: 18, cursor: 'pointer' }}>Ver historial</button>
      </aside>
    </div>
  );
};

export default ComponentCyPage;