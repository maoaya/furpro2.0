import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const gold = '#FFD700';

export default function GlobalNav({ open = true, onToggle }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menu = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: '🏠',
    },
    {
      label: 'Mi Perfil',
      path: '/perfil',
      icon: '👤',
    },
    {
      label: 'Usuarios',
      path: '/usuarios',
      icon: '👥',
    },
    {
      label: 'Torneos',
      path: '/torneos',
      icon: '🏆',
    },
    {
      label: 'Equipos',
      path: '/equipos',
      icon: '⚽',
    },
    {
      label: 'Chat IA',
      path: '/chat',
      icon: '💬',
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <nav style={{ 
      width: open ? 220 : 60, 
      transition: 'width 0.2s', 
      background: '#222', 
      color: '#fff', 
      borderRight: `2px solid ${gold}`,
      padding: '10px 0'
    }}>
      <button 
        onClick={onToggle} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: gold, 
          fontSize: 24, 
          margin: 10,
          cursor: 'pointer'
        }}
      >
        {open ? '⏪' : '⏩'}
      </button>
      
      {open && (
        <div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menu.map(item => (
              <li key={item.label} style={{ margin: '0' }}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    padding: '15px 20px',
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#333'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          
          <div style={{ marginTop: '20px', padding: '0 20px' }}>
            <button
              onClick={handleLogout}
              style={{
                background: '#ff4444',
                border: 'none',
                color: '#fff',
                padding: '12px 15px',
                width: '100%',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center'
              }}
            >
              <span>🚪</span>
              Salir
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}