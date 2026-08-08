import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SECCIONES = [
  { nombre: 'Inicio', icono: '🏠', ruta: '/', categoria: 'Principal' },
  { nombre: 'Mi Perfil', icono: '👤', ruta: '/perfil', categoria: 'Perfil' },
  { nombre: 'Perfil (Nuevo)', icono: '🎯', ruta: '/perfil/me', categoria: 'Perfil' },
  { nombre: 'Editar Perfil', icono: '✏️', ruta: '/editar-perfil', categoria: 'Perfil' },
  { nombre: 'Mis Estadísticas', icono: '📊', ruta: '/estadisticas', categoria: 'Perfil' },
  { nombre: 'Ver Equipos', icono: '👥', ruta: '/equipos', categoria: 'Equipos & Torneos' },
  { nombre: 'Crear Equipo', icono: '➕', ruta: '/crear-equipo', categoria: 'Equipos & Torneos' },
  { nombre: 'Ver Torneos', icono: '🏆', ruta: '/torneos', categoria: 'Equipos & Torneos' },
  { nombre: 'Crear Torneo', icono: '🏅', ruta: '/crear-torneo', categoria: 'Equipos & Torneos' },
  { nombre: 'Crear Amistoso', icono: '🤝', ruta: '/amistoso', categoria: 'Equipos & Torneos' },
  { nombre: 'Juego de Penaltis', icono: '⚽', ruta: '/penaltis', categoria: 'Juegos & Cards' },
  { nombre: 'Card Futpro', icono: '🆔', ruta: '/card-fifa', categoria: 'Juegos & Cards' },
  { nombre: 'Mis Tarjetas', icono: '🎴', ruta: '/tarjetas', categoria: 'Juegos & Cards' },
  { nombre: 'Notificaciones', icono: '🔔', ruta: '/notificaciones', categoria: 'Social' },
  { nombre: 'Chat', icono: '💬', ruta: '/chat', categoria: 'Social' },
  { nombre: 'Amigos', icono: '👫', ruta: '/amigos', categoria: 'Social' },
  { nombre: 'Videos', icono: '🎥', ruta: '/videos', categoria: 'Contenido' },
  { nombre: 'Marketplace', icono: '🏪', ruta: '/marketplace', categoria: 'Contenido' },
  { nombre: 'Transmitir en Vivo', icono: '📡', ruta: '/transmision-en-vivo', categoria: 'Contenido' },
  { nombre: 'Ranking Jugadores', icono: '📊', ruta: '/ranking-jugadores', categoria: 'Rankings' },
  { nombre: 'Ranking Equipos', icono: '📈', ruta: '/ranking-equipos', categoria: 'Rankings' },
  { nombre: 'Configuración', icono: '🔧', ruta: '/configuracion', categoria: 'Sistema' },
  { nombre: 'Soporte', icono: '🆘', ruta: '/soporte', categoria: 'Sistema' },
  { nombre: 'Privacidad', icono: '🛡️', ruta: '/privacidad', categoria: 'Sistema' }
  ,{ nombre: 'Diagnóstico Funciones', icono: '🧪', ruta: '/diagnostico-funciones', categoria: 'Sistema' }
];

export default function MenuHamburguesa({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState(null);

  const groupedSections = SECCIONES.reduce((acc, sec) => {
    if (!acc[sec.categoria]) acc[sec.categoria] = [];
    acc[sec.categoria].push(sec);
    return acc;
  }, {});

  const handleNavigation = (ruta) => {
    navigate(ruta);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 999,
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Menu Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '380px',
        maxWidth: '90vw',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        zIndex: 1000,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
        overflowY: 'auto',
        animation: 'slideInRight 0.3s ease-out'
      }}>
        <style>
          {`
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}
        </style>

        {/* Header - Estilo TopNavBar */}
        <div style={{
          background: '#0a0a0a',
          padding: '20px',
          borderBottom: '2px solid #FFD700'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: user ? '16px' : '0'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFD700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚽ <span style={{ fontWeight: '800' }}>FutPro</span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '2px solid #FFD700',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '18px',
                color: '#FFD700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#FFD700';
                e.target.style.color = '#0a0a0a';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#FFD700';
              }}
            >
              ✕
            </button>
          </div>
          
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#1a1a1a',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #333'
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: '2px solid #FFD700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#0a0a0a'
              }}>
                <img 
                  src={user.user_metadata?.avatar_url || user.user_metadata?.photo_url || `https://i.pravatar.cc/96?u=${user.id}`} 
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = '👤'; }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#FFD700', fontSize: '16px' }}>
                  {user.user_metadata?.full_name || user.user_metadata?.nombre || user.email?.split('@')[0]}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div style={{ padding: '16px' }}>
          {Object.entries(groupedSections).map(([categoria, items]) => (
            <div key={categoria} style={{ marginBottom: '24px' }}>
              <div style={{
                color: '#FFD700',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
                paddingLeft: '8px'
              }}>
                {categoria}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {items.map((sec) => {
                  const isHovered = hoveredItem === sec.ruta;
                  return (
                    <button
                      key={sec.ruta}
                      onClick={() => handleNavigation(sec.ruta)}
                      onMouseEnter={() => setHoveredItem(sec.ruta)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        background: isHovered 
                          ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                          : 'rgba(255,215,0,0.05)',
                        border: isHovered ? 'none' : '1px solid rgba(255,215,0,0.2)',
                        borderRadius: '12px',
                        color: isHovered ? '#000' : '#FFD700',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        width: '100%',
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{sec.icono}</span>
                      <span>{sec.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/login');
                onClose();
              }}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #ff3366, #ff6b6b)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '20px' }}>🚪</span>
              Cerrar Sesión
            </button>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px',
          textAlign: 'center',
          color: '#666',
          fontSize: '12px',
          borderTop: '1px solid #333'
        }}>
          FutPro 2.0 © 2025
        </div>
      </div>
    </>
  );
}
