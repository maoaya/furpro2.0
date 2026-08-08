// TopBar con logo, búsqueda y notificaciones
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#222',
      color: '#FFD700',
      padding: '15px 20px',
      borderBottom: '2px solid #FFD700'
    }}>
      <div 
        onClick={() => navigate('/dashboard')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer' 
        }}
      >
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#FFD700'
        }}>
          ⚽ FutPro
        </div>
      </div>
      
      <input 
        type="text" 
        placeholder="Buscar..." 
        style={{
          padding: '8px 15px',
          borderRadius: '20px',
          border: '1px solid #444',
          background: '#333',
          color: '#fff',
          width: '300px'
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            navigate(`/buscar/${e.target.value}`);
          }
        }}
      />
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => navigate('/notificaciones')}
          style={{
            background: 'transparent',
            border: '1px solid #FFD700',
            color: '#FFD700',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🔔
        </button>
        <button 
          onClick={() => navigate('/chat')}
          style={{
            background: 'transparent',
            border: '1px solid #FFD700',
            color: '#FFD700',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          💬
        </button>
      </div>
    </header>
  );
}
