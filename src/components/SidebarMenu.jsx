import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/perfil-avanzado', label: 'Perfil', icon: '👤' },
  { to: '/usuarios', label: 'Usuarios', icon: '👥' },
  { to: '/equipos', label: 'Equipos', icon: '⚽' },
  { to: '/torneos', label: 'Torneos', icon: '🏆' },
  { to: '/marketplace', label: 'Marketplace', icon: '🛒' },
  { to: '/logros', label: 'Logros', icon: '🥇' },
  { to: '/settings', label: 'Configuración', icon: '⚙️' },
  { to: '/faq', label: 'Ayuda', icon: '❓' },
];

function SidebarMenu() {
  const location = useLocation();
  return (
    <aside
      className="sidebar-menu shadow-2xl bg-gradient-to-b from-gray-900 to-gray-800 text-yellow-400 flex flex-col items-center py-6 px-2 min-h-screen w-20 md:w-24 z-30"
      aria-label="Menú principal FutPro"
      style={{ boxShadow: '2px 0 12px #FFD70022' }}
    >
      {menuItems.map(item => {
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            tabIndex={0}
            aria-label={item.label}
            title={item.label}
            className={`group flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 my-2 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-gray-700/80
              ${active ? 'bg-yellow-400 text-gray-900 shadow-lg scale-110' : 'hover:bg-yellow-400/20 hover:text-yellow-200'}
            `}
            style={{ fontWeight: 'bold', fontSize: 24, position: 'relative' }}
          >
            <span className="transition-transform duration-200 group-hover:scale-125 group-focus:scale-125">
              {item.icon}
            </span>
            <span className="text-xs mt-1 font-semibold tracking-wide group-hover:underline group-focus:underline">
              {item.label}
            </span>
            {active && (
              <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse border-2 border-gray-900" aria-hidden="true"></span>
            )}
          </Link>
        );
      })}
      <div className="flex-1" />
      <div className="text-xs text-gray-500 mt-8 mb-2 opacity-60 select-none">FutPro 2025</div>
    </aside>
  );
}

export default SidebarMenu;
