// ...existing code...
import React from 'react';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)', opacity: 1 }}>
      <h1 style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 24 }}>404</h1>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Página no encontrada</h2>
      <p style={{ fontSize: 20, marginBottom: 32 }}>La página que buscas no existe o fue movida.</p>
      <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', textDecoration: 'none' }} onClick={() => window.location.href = '/'}>
        Ir al inicio
      </Button>
    </div>
  );
}
// ...existing code...
