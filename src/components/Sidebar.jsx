import React from 'react';

const links = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Perfil', path: '/perfil' },
  { label: 'Equipos', path: '/equipos' },
  { label: 'Torneos', path: '/torneos' },
  { label: 'Partidos', path: '/partidos' },
  { label: 'Usuarios', path: '/usuarios' },
  { label: 'Moderación', path: '/moderacion' },
  { label: 'Estadísticas', path: '/estadisticas-avanzadas' },
  { label: 'Streaming', path: '/streaming' },
  { label: 'Pagos', path: '/pagos-marketplace' },
  { label: 'Invitaciones', path: '/invitaciones-solicitudes' },
  { label: 'Historial', path: '/historial' },
  { label: 'Integraciones', path: '/integraciones-api' },
  { label: 'Ayuda', path: '/ayuda-faq' },
  { label: 'Soporte', path: '/soporte' },
  { label: 'Validador Web', path: '/validador-web' },
  { label: 'Validar Usuario', path: '/validar-usuario' },
  { label: 'Validador Web Colaborativo', path: '/validador-web-colaborativo' }
];

export default function Sidebar() {
  return (
    <aside style={{width:220,background:'#222',color:'#fff',padding:'24px 0',height:'100vh'}}>
      <nav>
        <ul style={{listStyle:'none',padding:0,margin:0}}>
          {links.map(link => (
            <li key={link.path} style={{margin:'12px 0'}}>
              <a href={`#${link.path}`} style={{color:'#fff',textDecoration:'none',padding:'8px 16px',display:'block'}}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
