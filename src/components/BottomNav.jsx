import React, { startTransition } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Inicio', path: '/', icon: '🏠', prefetch: null },
  { label: 'Mercado', path: '/marketplace', icon: '🛍️', prefetch: () => import('../pages/MarketplaceCompleto') },
  { label: 'Videos', path: '/videos', icon: '🎥', prefetch: () => import('../pages/VideosFeed') },
  { label: 'Alertas', path: '/notificaciones', icon: '🔔', prefetch: null },
  { label: 'Chat', path: '/chat', icon: '💬', prefetch: () => import('../pages/Chat') },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const go = (path) => {
    // Nav client-side con transición — mantiene UI responsive
    startTransition(() => {
      navigate(path);
    });
  };

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
      {navItems.map(item => {
        const active =
          location.pathname === item.path ||
          (item.path === '/marketplace' && location.pathname.startsWith('/mercado'));
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e) => {
              e.preventDefault();
              go(item.path);
            }}
            onMouseEnter={() => {
              try { item.prefetch?.(); } catch { /* noop */ }
            }}
            onTouchStart={() => {
              try { item.prefetch?.(); } catch { /* noop */ }
            }}
            style={{
              textDecoration: 'none',
              color: active ? '#FFD700' : '#999',
              background: 'transparent',
              borderRadius: 16,
              padding: '8px 12px',
              fontSize: 14,
              fontWeight: active ? 'bold' : 'normal',
              boxShadow: 'none',
              transition: 'color 0.12s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.7rem' }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
