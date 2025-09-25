import React from 'react';

export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      color: '#FFD700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#2a2a2a',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        border: '2px solid #FFD700'
      }}>
        <h1 style={{ color: '#FFD700', marginBottom: '20px' }}>
          ✅ FutPro Funcionando
        </h1>
        <p style={{ color: '#ccc', marginBottom: '20px' }}>
          Esta es una página de prueba para verificar que el sistema funciona
        </p>
        <button
          onClick={() => window.location.href = '/registro'}
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
          Ir al Registro
        </button>
      </div>
    </div>
  );
}