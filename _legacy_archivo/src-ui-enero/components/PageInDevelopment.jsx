import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageInDevelopment({ title, icon = '🔧' }) {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '40px',
      background: '#1a1a1a',
      color: '#FFD700',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>{icon}</div>
      <h1>{title}</h1>
      <p style={{ color: '#ccc', fontSize: '18px', marginBottom: '30px' }}>
        Esta página está en desarrollo. Pronto estará disponible con todas las funcionalidades.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          background: '#FFD700',
          color: '#1a1a1a',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        ← Volver al Dashboard
      </button>
    </div>
  );
}