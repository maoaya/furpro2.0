// ...existing code...
import React from 'react';
import Button from '../components/Button';

export default function TestQAInternaPage() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto', transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)', opacity: 1 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Testeo / QA Interna</h2>
      <ul style={{ fontSize: 18 }}>
        <li style={{ background: '#232323', borderRadius: 8, padding: 16, color: '#FFD700', marginBottom: 16 }}>Panel para pruebas internas y validación de módulos.</li>
        <li style={{ background: '#232323', borderRadius: 8, padding: 16, color: '#FFD700', marginBottom: 16 }}>Historial de test y resultados.</li>
      </ul>
      <Button style={{ marginTop: 32 }}>Ejecutar test</Button>
    </div>
  );
}
// ...existing code...
