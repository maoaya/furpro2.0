
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Inicio', path: '/', icon: '🏠' },
  { label: 'Market', path: '/marketplace', icon: '🛍️' },
  { label: 'Videos', path: '/videos', icon: '🎥' },
  { label: 'Alertas', path: '/notificaciones', icon: '🔔' },
  { label: 'Chat', path: '/chat', icon: '💬' }
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      background: '#000',
      borderTop: '2px solid #FFD700',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0',
      boxShadow: '0 -2px 12px rgba(255,215,0,0.2)',
      zIndex: 100,
    }}>
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            textDecoration: 'none',
            color: location.pathname === item.path ? '#FFD700' : '#999',
            background: 'transparent',
            borderRadius: 16,
            padding: '8px 12px',
            fontSize: 14,
            fontWeight: location.pathname === item.path ? 'bold' : 'normal',
            boxShadow: 'none',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== item.path) {
              e.currentTarget.style.color = '#FFD700';
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== item.path) {
              e.currentTarget.style.color = '#999';
            }
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
          <span style={{ fontSize: '0.7rem' }}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
