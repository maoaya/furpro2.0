import React from 'react';

export default function CompartirContenidoPage() {
  return (
    <div style={{ padding: 32, color: '#FFD700', background: '#181818', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Compartir Contenido</h1>
      <p style={{ fontSize: 18, color: '#FFD70099' }}>
        Comparte tu contenido de FutPro en redes sociales.
      </p>
      <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
        <button style={{ padding: '12px 24px', background: '#FFD700', color: '#000', fontWeight: 'bold', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
          Compartir en Facebook
        </button>
        <button style={{ padding: '12px 24px', background: '#FFD700', color: '#000', fontWeight: 'bold', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
          Compartir en Twitter
        </button>
        <button style={{ padding: '12px 24px', background: '#FFD700', color: '#000', fontWeight: 'bold', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
          Compartir en WhatsApp
        </button>
      </div>
    </div>
  );
}
