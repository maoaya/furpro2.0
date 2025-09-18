import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#181818', color: '#FFD700' }}>
      <aside style={{ width: 260, background: '#222', padding: 24, borderRight: '2px solid #FFD700' }}>
        <h2 style={{ color: '#FFD700' }}>Panel de Administración</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link to="/admin/usuarios" style={{ color: '#FFD700' }}>Usuarios</Link>
          <Link to="/admin/pagos" style={{ color: '#FFD700' }}>Pagos</Link>
          <Link to="/admin/reportes" style={{ color: '#FFD700' }}>Reportes</Link>
          <Link to="/admin/notificaciones" style={{ color: '#FFD700' }}>Notificaciones</Link>
          <Link to="/admin/estadisticas" style={{ color: '#FFD700' }}>Estadísticas</Link>
          <Link to="/admin/auditoria" style={{ color: '#FFD700' }}>Auditoría</Link>
          <Link to="/admin/configuracion" style={{ color: '#FFD700' }}>Configuración</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}
