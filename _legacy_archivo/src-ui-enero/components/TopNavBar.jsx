import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';

export default function TopNavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    if (user) {
      cargarDatosUsuario();
    }
  }, [user]);

  const cargarDatosUsuario = async () => {
    try {
      const { data } = await supabase
        .from('carfutpro')
        .select('nombre, apellido, photo_url, avatar_url')
        .eq('user_id', user.id)
        .single();
      setUserData(data);
    } catch (error) {
      console.error('Error cargando datos usuario:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{
      background: '#000',
      borderBottom: '2px solid #FFD700',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <div 
        onClick={() => navigate('/')}
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#FFD700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ⚽ FutPro
      </div>

      {/* Centro: Buscador */}
      <div style={{
        flex: 1,
        maxWidth: '400px',
        marginLeft: '20px',
        marginRight: '20px'
      }}>
        <input
          type="text"
          placeholder="🔍 Buscar usuario, equipo, torneo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              navigate(`/buscar-ranking?q=${encodeURIComponent(searchQuery)}`);
            }
          }}
          style={{
            width: '100%',
            padding: '10px 15px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            background: '#1a1a1a',
            color: '#fff',
            fontSize: '0.95rem'
          }}
        />
      </div>

      {/* Derecha: Campana + Menu */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}>
        {/* Campana de notificaciones */}
        <div
          onClick={() => navigate('/notificaciones')}
          style={{
            position: 'relative',
            cursor: 'pointer',
            fontSize: '1.5rem'
          }}
        >
          🔔
          {notifications > 0 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#FF6B6B',
              color: '#fff',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {notifications}
            </div>
          )}
        </div>

        {/* Menu desplegable */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent',
              border: '2px solid #FFD700',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}
          >
            ☰
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              background: '#1a1a1a',
              border: '2px solid #FFD700',
              borderRadius: '12px',
              minWidth: '300px',
              boxShadow: '0 8px 24px rgba(255,215,0,0.3)',
              zIndex: 1001
            }}>
              {/* Header con usuario */}
              <div style={{
                padding: '15px',
                borderBottom: '1px solid #333',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <img
                  src={userData?.photo_url || userData?.avatar_url || `https://i.pravatar.cc/300?u=${user?.id}`}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    border: '2px solid #FFD700',
                    objectFit: 'cover'
                  }}
                  alt="Avatar"
                />
                <div>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#FFD700',
                    fontSize: '0.95rem'
                  }}>
                    {(userData?.nombre || '') + ' ' + (userData?.apellido || '')}
                  </div>
                </div>
              </div>

              {/* Opciones del menu */}
              <div style={{ padding: '10px 0' }}>
                <MenuItem icon="👤" label="Mi Perfil" onClick={() => { navigate('/perfil'); setMenuOpen(false); }} />
                <MenuItem icon="✏️" label="Editar Perfil" onClick={() => { navigate('/editar-perfil'); setMenuOpen(false); }} />
                <MenuItem icon="🎴" label="Mi Card" onClick={() => { navigate('/perfil-card'); setMenuOpen(false); }} />
                <MenuItem icon="📊" label="Estadísticas" onClick={() => { navigate('/estadisticas'); setMenuOpen(false); }} />
                <MenuItem icon="⚙️" label="Configuración" onClick={() => { navigate('/configuracion'); setMenuOpen(false); }} />
                <hr style={{ margin: '10px 0', borderColor: '#333' }} />
                <MenuItem icon="🚪" label="Cerrar Sesión" onClick={handleLogout} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 15px',
        cursor: 'pointer',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        color: '#fff',
        fontSize: '0.95rem',
        transition: 'background 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
