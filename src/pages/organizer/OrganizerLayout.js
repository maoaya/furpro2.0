import React from 'react';

export default function OrganizerLayout({ title, children }) {
  const navItems = [
    { path: '/organizer/teams', label: 'Equipos' },
    { path: '/organizer/teams/invite', label: 'Invitar Equipo' },
    { path: '/organizer/teams/requests', label: 'Solicitudes' },
    { path: '/organizer/teams/list', label: 'Inscritos' },
    { path: '/organizer/matches', label: 'Partidos' },
    { path: '/organizer/matches/schedule', label: 'Programar Partido' },
    { path: '/organizer/results', label: 'Resultados' },
    { path: '/organizer/standings', label: 'Tabla de Posiciones' },
    { path: '/organizer/communications', label: 'Comunicaciones' },
    { path: '/organizer/prizes', label: 'Premios' },
    { path: '/organizer/payments', label: 'Pagos' },
    { path: '/organizer/stats', label: 'Estadísticas' },
    { path: '/organizer/staff', label: 'Staff' },
    { path: '/organizer/support', label: 'Soporte' },
    { path: '/organizer/media', label: 'Galería' },
    { path: '/organizer/chat', label: 'Chat' },
    { path: '/organizer/live', label: 'Transmisión en Vivo' }
  ];
  return (
    <div className="organizer-layout">
      <header>
        <h1>{title}</h1>
        <nav>
          <ul style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {navItems.map(item => (
              <li key={item.path}>
                <a href={item.path}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
