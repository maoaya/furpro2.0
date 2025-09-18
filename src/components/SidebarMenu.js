import React from 'react';
import { NavLink } from 'react-router-dom';

function SidebarMenu() {
  const menuItems = [
    { to: '/', label: 'Feed', icon: '🏠' },
    { to: '/perfil/1', label: 'Perfil', icon: '👤' },
    { to: '/notificaciones', label: 'Notificaciones', icon: '🔔' },
    { to: '/admin', label: 'Admin', icon: '🛠️' },
    { to: '/ranking', label: 'Ranking', icon: '📊' },
    { to: '/progreso', label: 'Progreso', icon: '📈' },
    { to: '/penaltis', label: 'Penaltis', icon: '🥅' },
    { to: '/historial-penaltis', label: 'Historial Penaltis', icon: '📜' },
    { to: '/ayuda', label: 'Ayuda', icon: '❓' },
    { to: '/configuracion', label: 'Configuración', icon: '⚙️' },
    { to: '/compartir', label: 'Compartir', icon: '🔗' },
    { to: '/chat-sql', label: 'Chat SQL', icon: '💬' },
    { to: '/marketplace', label: 'Marketplace', icon: '🛒' },
    { to: '/soporte', label: 'Soporte', icon: '🆘' },
    { to: '/logros', label: 'Logros', icon: '🏆' },
    { to: '/estadisticas-avanzadas', label: 'Estadísticas', icon: '📈' },
    { to: '/comparativas', label: 'Comparativas', icon: '⚖️' },
  ];
  return (
    <nav style={{width:'80px',background:'#222',display:'flex',flexDirection:'column',alignItems:'center',paddingTop:'24px',borderRight:'2px solid #FFD700'}}>
      {menuItems.map(item => (
        <NavLink key={item.to} to={item.to} style={({isActive})=>({
          color: isActive ? '#FFD700' : '#fff',
          textDecoration:'none',
          margin:'16px 0',
          fontSize:'24px',
          fontWeight:'bold',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
        })}>
          <span>{item.icon}</span>
          <span style={{fontSize:'12px'}}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default SidebarMenu;
