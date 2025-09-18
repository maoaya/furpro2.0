// ...existing code...
import React from 'react';
import Button from '../components/Button';

export default function RedesSocialesIntegracionPage() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto', transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)', opacity: 1 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Integración con Redes Sociales</h2>
      <ul style={{ fontSize: 18 }}>
        <li style={{ background: '#232323', borderRadius: 8, padding: 16, color: '#FFD700', marginBottom: 16 }}>Facebook, Google, Twitter, Instagram.</li>
        <li style={{ background: '#232323', borderRadius: 8, padding: 16, color: '#FFD700', marginBottom: 16 }}>Estado y configuración de APIs.</li>
      </ul>
      <Button style={{ marginTop: 32 }}>Configurar APIs</Button>
    </div>
  );
}
// ...existing code...
