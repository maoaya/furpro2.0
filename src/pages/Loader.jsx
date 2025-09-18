// ...existing code...
import React from 'react';

export default function Loader({ text = 'Cargando...' }) {
  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 'bold' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loader" style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 48 }}>⏳</span>
        </div>
        {text}
      </div>
    </div>
  );
}
// ...existing code...
