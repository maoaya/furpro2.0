import React, { useState } from 'react';

export default function SupabaseConfigPanel() {
  const [msg, setMsg] = useState('');
  function handleConsultar() {
    setMsg('Consultando configuración supabase...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleFiltrar() {
    setMsg('Filtrando configuración supabase...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleVolver() {
    setMsg('Volviendo...');
    setTimeout(() => setMsg(''), 2000);
  }
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Supabase Config</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button onClick={handleConsultar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Consultar</button>
        <button onClick={handleFiltrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Filtrar</button>
        <button onClick={handleVolver} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Volver</button>
      </div>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32 }}>
        <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Gráfico de actividad de configuración supabase</h3>
        <svg width="100%" height="120" viewBox="0 0 400 120">
          {/* ...SVG de ejemplo... */}
        </svg>
      </div>
      {msg && <div style={{ color: '#FFD700', fontWeight: 'bold', marginTop: 24 }}>{msg}</div>}
    </div>
  );
}
