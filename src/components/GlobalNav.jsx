import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const gold = '#FFD700';

export default function GlobalNav({ open = true, onToggle }) {
  const navigate = useNavigate();
  const { logout, userProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menu = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: '🏠',
    },
    {
      label: 'Mi Perfil',
      path: '/perfil',
      icon: '👤',
    },
    {
      label: 'Usuarios',
      path: '/usuarios',
      icon: '👥',
    },
    {
      label: 'Torneos',
      path: '/torneos',
      icon: '🏆',
    },
    {
      label: 'Equipos',
      path: '/equipos',
      icon: '⚽',
    },
    {
      label: 'Chat IA',
      path: '/chat',
      icon: '💬',
    },
  ];

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/perfil/me');
  };

  const handleMenuItemClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const defaultAvatar = 'https://via.placeholder.com/50';
  const avatarUrl = userProfile?.avatar_url || defaultAvatar;
  const userName = userProfile?.nombre || 'Usuario';
  const userLastName = userProfile?.apellido || '';

  return (
    <nav style={{ 
      width: open ? 220 : 60, 
      transition: 'width 0.2s', 
      background: '#222', 
      color: '#fff', 
      borderRight: `2px solid ${gold}`,
      padding: '10px 0'
    }}>
      <button 
        onClick={onToggle} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: gold, 
          fontSize: 24, 
          margin: 10,
          cursor: 'pointer'
        }}
      >
        {open ? '⏪' : '⏩'}
      </button>
      
      {open && (
        <div>
          {/* ===== USER DROPDOWN MENU ===== */}
          <div className="user-menu" style={{ position: 'relative', margin: '0 10px 20px' }}>
            <button
              className="user-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#333',
                border: `2px solid ${gold}`,
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '14px',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#333'}
            >
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `2px solid ${gold}`
                }}
              />
              <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: gold }}>
                  {userName} {userLastName}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>
                  {userProfile?.rol || 'Player'}
                </div>
              </div>
              <span style={{ fontSize: '12px' }}>▼</span>
            </button>

            {/* ===== DROPDOWN MENU ===== */}
            {dropdownOpen && (
              <div className="user-dropdown show" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#333',
                border: `1px solid ${gold}`,
                borderRadius: '8px',
                marginTop: '8px',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
              }}>
                {/* Header con avatar */}
                <div className="dropdown-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 15px',
                  borderBottom: `1px solid ${gold}20`
                }}>
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${gold}`
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', color: gold, fontSize: '14px' }}>
                      {userName} {userLastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>
                      {userProfile?.email}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <button
                    onClick={handleProfileClick}
                    className="dropdown-item"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 15px',
                      background: 'none',
                      border: 'none',
                      color: '#ccc',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#444';
                      e.currentTarget.style.color = gold;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.color = '#ccc';
                    }}
                  >
                    <span>👤</span>
                    Ver Perfil Completo
                  </button>

                  <button
                    onClick={() => handleMenuItemClick('/tarjetas')}
                    className="dropdown-item"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 15px',
                      background: 'none',
                      border: 'none',
                      color: '#ccc',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#444';
                      e.currentTarget.style.color = gold;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.color = '#ccc';
                    }}
                  >
                    <span>🆔</span>
                    Mis Tarjetas
                  </button>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: `${gold}20` }}></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 15px',
                    background: 'none',
                    border: 'none',
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ff6b6b20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <span>🚪</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menu.map(item => (
              <li key={item.label} style={{ margin: '0' }}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    padding: '15px 20px',
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#333'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          
          <div style={{ marginTop: '20px', padding: '0 20px' }}>
            <button
              onClick={handleLogout}
              style={{
                background: '#ff4444',
                border: 'none',
                color: '#fff',
                padding: '12px 15px',
                width: '100%',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center'
              }}
            >
              <span>🚪</span>
              Salir
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}