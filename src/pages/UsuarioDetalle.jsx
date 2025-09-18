import React from 'react';
import { Link } from 'react-router-dom';

// Breadcrumbs y navegación global FutPro
const breadcrumbs = [
  { label: 'Inicio', path: '/' },
  { label: 'Ranking', path: '/ranking' },
  { label: 'Equipos', path: '/equipos' },
  { label: 'Torneos', path: '/torneos' },
  { label: 'Perfil', path: '/perfil' },
  { label: 'Programación', path: '/programacion' },
  // ...agrega más rutas si es necesario
];

function BreadcrumbsNav() {
  return (
    <nav className="breadcrumbs-nav" style={{ margin: '16px 0', fontSize: '1rem' }}>
      {breadcrumbs.map((crumb, idx) => (
        <span key={crumb.path}>
          <Link to={crumb.path} style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold' }}>{crumb.label}</Link>
          {idx < breadcrumbs.length - 1 && <span style={{ color: '#222', margin: '0 8px' }}>/</span>}
        </span>
      ))}
    </nav>
  );
}

const UsuarioDetalle = () => {
  return (
    <div>
      <BreadcrumbsNav />
      {/* ...contenido principal de la página... */}
    </div>
  );
};

export default UsuarioDetalle;