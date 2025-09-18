import React from 'react';
import Button from './Button';

export default function Inicio() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ fontSize: 40, fontWeight: 'bold', marginBottom: 24 }}>Bienvenido a FutPro 2.0</h1>
      <p style={{ fontSize: 22, marginBottom: 32 }}>Tu feed deportivo y social.</p>
      {/* Aquí puedes renderizar el componente Feed, noticias, etc. */}
      <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '14px 40px', fontWeight: 'bold', fontSize: 20, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Ir al Feed</button>
    <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '14px 40px', fontWeight: 'bold', fontSize: 20, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Ir al Feed</Button>
    </div>
  );
}
