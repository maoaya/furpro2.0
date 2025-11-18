
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Inicio', path: '/', icon: '🏠' },
  { label: 'Estados', path: '/estados', icon: '📱' },
  { label: 'Amigos', path: '/amigos', icon: '👫' },
  { label: 'Torneos', path: '/torneos', icon: '🏆' },
  { label: 'Perfil', path: '/perfil', icon: '👤' }
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      background: '#181818',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0',
      boxShadow: '0 -2px 8px #FFD70022',
      zIndex: 100,
    }}>
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            textDecoration: 'none',
            color: location.pathname === item.path ? '#181818' : '#FFD700',
            background: location.pathname === item.path ? '#FFD700' : 'transparent',
            borderRadius: 16,
            padding: '8px 16px',
            fontSize: 28,
            fontWeight: 'bold',
            boxShadow: location.pathname === item.path ? '0 2px 8px #FFD70088' : 'none',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <span>{item.icon}</span>
          <span style={{ fontSize: 10 }}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
