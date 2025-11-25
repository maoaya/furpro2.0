import React, { useState } from 'react';

const SECCIONES = [
  { nombre: 'Inicio', icono: '🏠', accion: 'irAInicio' },
  { nombre: 'Mi Perfil', icono: '👤', accion: 'irAPerfil' },
  { nombre: 'Editar Perfil', icono: '✏️', accion: 'editarPerfil' },
  { nombre: 'Mis Estadísticas', icono: '📊', accion: 'verEstadisticas' },
  { nombre: 'Mis Partidos', icono: '📅', accion: 'verPartidos' },
  { nombre: 'Mis Logros', icono: '🏆', accion: 'verLogros' },
  { nombre: 'Mis Tarjetas', icono: '🆔', accion: 'verTarjetas' },
  { nombre: 'Ver Equipos', icono: '👥', accion: 'verEquipos' },
  { nombre: 'Crear Equipo', icono: '➕', accion: 'crearEquipo' },
  { nombre: 'Ver Torneos', icono: '🏆', accion: 'verTorneos' },
  { nombre: 'Crear Torneo', icono: '➕', accion: 'crearTorneo' },
  { nombre: 'Crear Amistoso', icono: '🤝', accion: 'crearAmistoso' },
  { nombre: 'Juego de Penaltis', icono: '⚽', accion: 'jugarPenaltis' },
  { nombre: 'Card Futpro', icono: '🆔', accion: 'verCardFIFA' },
  { nombre: 'Sugerencias Card', icono: '💡', accion: 'sugerenciasCard' },
  { nombre: 'Notificaciones', icono: '🔔', accion: 'verNotificaciones' },
  { nombre: 'Chat', icono: '💬', accion: 'abrirChat' },
  { nombre: 'Videos', icono: '🎥', accion: 'verVideos' },
  { nombre: 'Marketplace', icono: '🏪', accion: 'abrirMarketplace' },
  { nombre: 'Estados', icono: '📋', accion: 'verEstados' },
  { nombre: 'Amigos', icono: '👫', accion: 'verAmigos' },
  { nombre: 'Transmitir en Vivo', icono: '📡', accion: 'abrirTransmisionEnVivo' },
  { nombre: 'Ranking Jugadores', icono: '📊', accion: 'rankingJugadores' },
  { nombre: 'Ranking Equipos', icono: '📈', accion: 'rankingPartidos' },
  { nombre: 'Buscar Ranking', icono: '🔍', accion: 'buscarRanking' },
  { nombre: 'Configuración', icono: '🔧', accion: 'abrirConfiguracion' },
  { nombre: 'Soporte', icono: '🆘', accion: 'contactarSoporte' },
  { nombre: 'Privacidad', icono: '🛡️', accion: 'verPrivacidad' }
];

export default function MenuHamburguesa({ onAccion }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div>
      <button onClick={() => setAbierto(!abierto)} style={{ fontSize: 32 }}>🍔</button>
      {abierto && (
        <div style={{ position: 'absolute', top: 50, left: 0, background: '#fff', zIndex: 1000, boxShadow: '0 2px 8px #0002', padding: 16 }}>
          <h2>Menú FutPro</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {SECCIONES.map(sec => (
              <li key={sec.accion} style={{ margin: '8px 0' }}>
                <button onClick={() => onAccion(sec.accion)} style={{ fontSize: 20 }}>
                  {sec.icono} {sec.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
