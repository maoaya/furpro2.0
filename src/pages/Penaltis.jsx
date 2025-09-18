import React from 'react';

export default function Penaltis() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Penaltis</h2>
      {/* Minijuego de penaltis, estadísticas, etc. */}
      <div style={{ background: '#232323', borderRadius: 8, padding: '24px', color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', marginTop: 24 }}>
        <p style={{ fontSize: 18 }}>Juega el minijuego de penaltis y consulta tus estadísticas.</p>
      </div>
    </div>
  );
}
