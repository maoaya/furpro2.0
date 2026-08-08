import React from 'react';
import Button from '../components/Button';

export default function Streaming() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '900px', margin: 'auto', transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)', opacity: 1 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Streaming / Transmisiones</h2>
      {/* Video en vivo, chat, controles */}
      <div style={{ background: '#232323', borderRadius: 8, padding: '24px', color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', marginTop: 24 }}>
        <p style={{ fontSize: 18 }}>Aquí podrás ver transmisiones en vivo, interactuar en el chat y acceder a controles de streaming.</p>
        <Button style={{ marginTop: 24 }}>Iniciar transmisión</Button>
      </div>
    </div>
  );
}
