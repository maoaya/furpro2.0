import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

const gold = '#FFD700';
const black = '#181818';

const menu = [
  {
    label: 'Inicio',
    path: '#feed',
    icon: '🏠',
  },
  {
    label: 'Mi Perfil',
    path: '#perfil',
    icon: '�',
  },
  {
    label: 'Subir',
    path: '#subir',
    icon: '⬆️',
  },
  {
    label: 'Explorar',
    path: '#explorar',
    icon: '�',
  },
  {
    label: 'Salir',
    path: '#logout',
    icon: '�',
  },
];

export default function GlobalNav({ open = true, onToggle }) {
  return (
    <nav className="global-nav" style={{ width: open ? 220 : 60, transition: 'width 0.2s', background: '#222', color: '#fff', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 10 }}>
      <button onClick={onToggle} style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: 24, margin: 10 }}>
        {open ? '⏪' : '⏩'}
      </button>
      {open && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menu.map(item => (
            <li key={item.label} style={{ margin: '18px 0' }}>
              <a href={item.path} style={{ color: '#fff', textDecoration: 'none', fontSize: 18 }}>
                <span style={{ marginRight: 10 }}>{item.icon}</span>{item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
