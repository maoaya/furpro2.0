// ...existing code...
import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarMenu() {
  return (
    <aside style={{ background: '#232323', color: '#FFD700', width: 220, minHeight: '100vh', padding: 32, boxShadow: '0 2px 12px #FFD70022', borderRadius: '0 18px 18px 0', position: 'fixed', left: 0, top: 0 }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Link to="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>Inicio</Link>
        <Link to="/perfil" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>Perfil</Link>
        <Link to="/equipos" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>Equipos</Link>
        <Link to="/torneos" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>Torneos</Link>
        <Link to="/feed" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>Feed</Link>
        <Link to="/estadisticas" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>Estadísticas</Link>
        <Link to="/admin" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>Admin</Link>
        <Link to="/ayuda" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>Ayuda</Link>
      </nav>
    </aside>
  );
}
// ...existing code...
