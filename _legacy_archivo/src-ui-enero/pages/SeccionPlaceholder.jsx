import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const gold = '#FFD700';
const dark = '#0a0a0a';

const sections = {
  perfil: { title: '👤 Mi Perfil', desc: 'Administra tu perfil, foto y bio.' },
  estadisticas: { title: '📊 Mis Estadisticas', desc: 'Métricas personales y rendimiento.' },
  partidos: { title: '📅 Mis Partidos', desc: 'Calendario de próximos partidos y resultados.' },
  logros: { title: '🏆 Mis Logros', desc: 'Trofeos y badges obtenidos.' },
  tarjetas: { title: '🆔 Mis Tarjetas', desc: 'Tus cards y credenciales FutPro.' },
  equipos: { title: '👥 Ver Equipos', desc: 'Explora equipos disponibles y tus invitaciones.' },
  'crear-equipo': { title: '➕ Crear Equipo', desc: 'Crea un nuevo equipo y gestiona tus miembros.' },
  torneos: { title: '🏆 Ver Torneos', desc: 'Torneos activos y próximos.' },
  'crear-torneo': { title: '➕ Crear Torneo', desc: 'Configura un torneo con tus reglas.' },
  amistoso: { title: '🤝 Crear Amistoso', desc: 'Arma amistosos y comparte invitaciones.' },
  penaltis: { title: '⚽ Juego de Penaltis', desc: 'Mini-juego de penaltis.' },
  'card-fifa': { title: '🆔 Card Futpro', desc: 'Visualiza y comparte tu card FutPro.' },
  'sugerencias-card': { title: '💡 Sugerencias Card', desc: 'Solicita cambios o mejoras en tu card.' },
  notificaciones: { title: '🔔 Notificaciones', desc: 'Alertas de actividad y novedades.' },
  chat: { title: '💬 Chat', desc: 'Mensajes y conversaciones.' },
  videos: { title: '🎥 Videos', desc: 'Contenido multimedia y highlights.' },
  marketplace: { title: '🏪 Marketplace', desc: 'Compra/venta de artículos y servicios.' },
  estados: { title: '📋 Estados', desc: 'Publica y revisa estados cortos.' },
  seguidores: { title: '👫 Seguidores', desc: 'Gestión de seguidores y siguiendo.' },
  vivo: { title: '📡 Transmitir en Vivo', desc: 'Inicia o gestiona transmisiones en vivo.' },
  'ranking-jug': { title: '📊 Ranking Jugadores', desc: 'Ranking de jugadores FutPro.' },
  'ranking-eq': { title: '📈 Ranking Equipos', desc: 'Ranking de equipos FutPro.' },
  'buscar-ranking': { title: '🔍 Buscar Ranking', desc: 'Filtra y busca rankings específicos.' },
  config: { title: '🔧 Configuracion', desc: 'Preferencias y ajustes de la app.' },
  soporte: { title: '🆘 Soporte', desc: 'Centro de ayuda y tickets.' },
  privacidad: { title: '🛡️ Privacidad', desc: 'Controles de privacidad y permisos.' },
};

export default function SeccionPlaceholder() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const info = sections[slug] || { title: 'Sección', desc: 'Contenido en construcción.' };

  return (
    <div style={{ minHeight: '100vh', background: dark, color: gold, fontFamily: 'Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        width: '100%',
        maxWidth: 720,
        background: '#111',
        border: `2px solid ${gold}`,
        borderRadius: 18,
        padding: 28,
        boxShadow: '0 12px 32px rgba(0,0,0,0.55)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>{info.title}</h1>
          <button onClick={() => navigate('/')} style={{ background: gold, color: '#111', border: 'none', borderRadius: 12, padding: '10px 14px', fontWeight: 800, cursor: 'pointer' }}>🏠 Home</button>
        </div>
        <p style={{ marginTop: 0, color: '#ddd', lineHeight: 1.5 }}>{info.desc}</p>
        <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/login')} style={btn()}>🔐 Ir a Login</button>
          <button onClick={() => navigate('/seleccionar-categoria')} style={btn()}>🗂️ Categoría</button>
          <button onClick={() => navigate('/formulario-registro')} style={btn()}>📝 Registro</button>
          <button onClick={() => navigate('/perfil-card')} style={btn()}>🆔 Card</button>
        </div>
      </div>
    </div>
  );
}

function btn() {
  return {
    background: 'linear-gradient(135deg,#FFD700,#FFB347)',
    color: '#111',
    border: 'none',
    borderRadius: 10,
    padding: '10px 12px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(255,215,0,0.25)'
  };
}
