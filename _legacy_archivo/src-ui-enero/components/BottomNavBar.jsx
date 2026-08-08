import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UploadContenidoComponent from './UploadContenidoComponent';

const gold = '#FFD700';
const darkGray = '#1a1a1a';

export default function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const [uploadMode, setUploadMode] = useState(null);
  const fileInputRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleCameraClick = () => {
    setShowCameraMenu(!showCameraMenu);
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setUploadMode(type);
      setShowUploadModal(true);
      setShowCameraMenu(false);
    }
  };

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/', color: gold },
    { icon: '🛒', label: 'Market', path: '/marketplace', color: '#4CAF50' },
    { icon: '📸', label: 'Cámara', isCamera: true, color: gold },
    { icon: '🔔', label: 'Alertas', path: '/notificaciones', color: '#FFB347' },
    { icon: '💬', label: 'Chat', path: '/chat', color: '#9C27B0' }
  ];

  return (
    <>
      {/* Menú desplegable de cámara */}
      {showCameraMenu && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
          border: `2px solid ${gold}`,
          borderRadius: '16px',
          padding: '12px',
          boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
          zIndex: 999,
          minWidth: '200px'
        }}>
          <button onClick={() => { setUploadMode('foto'); setShowUploadModal(true); setShowCameraMenu(false); }} style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 215, 0, 0.1)',
            border: 'none',
            borderRadius: '8px',
            color: gold,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '8px',
            textAlign: 'left'
          }}>
            📷 Tomar Foto
          </button>
          <button onClick={() => { setUploadMode('video'); setShowUploadModal(true); setShowCameraMenu(false); }} style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 215, 0, 0.1)',
            border: 'none',
            borderRadius: '8px',
            color: gold,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '8px',
            textAlign: 'left'
          }}>
            🎥 Grabar Video
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e, 'foto')}
          />
          <button onClick={() => fileInputRef.current?.click()} style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 215, 0, 0.1)',
            border: 'none',
            borderRadius: '8px',
            color: gold,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '8px',
            textAlign: 'left'
          }}>
            📁 Subir Foto/Video
          </button>
          <button onClick={() => { setUploadMode('historia'); setShowUploadModal(true); setShowCameraMenu(false); }} style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 215, 0, 0.1)',
            border: 'none',
            borderRadius: '8px',
            color: gold,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '8px',
            textAlign: 'left'
          }}>
            ⭐ Subir Historia
          </button>
          <button onClick={() => { setUploadMode('transmision'); setShowUploadModal(true); setShowCameraMenu(false); }} style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 215, 0, 0.1)',
            border: 'none',
            borderRadius: '8px',
            color: gold,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            textAlign: 'left'
          }}>
            🔴 Transmisión en Vivo
          </button>
        </div>
      )}

      {/* Modal de upload */}
      {showUploadModal && (
        <UploadContenidoComponent 
          onClose={() => { setShowUploadModal(false); setUploadMode(null); }}
          mode={uploadMode}
        />
      )}

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
        borderTop: `2px solid ${gold}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
        zIndex: 100
      }}>
        {navItems.map((item, index) => (
          item.isCamera ? (
            <button
              key="camera"
              onClick={handleCameraClick}
              style={{
                background: `linear-gradient(135deg, ${gold}, #FF9F0D)`,
                border: `2px solid ${gold}`,
                borderRadius: 16,
                padding: '10px 16px',
                color: '#0a0a0a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: 12,
                fontWeight: 800,
                boxShadow: `0 4px 15px ${gold}44`,
                transform: 'translateY(-2px)'
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 10, letterSpacing: 0.5 }}>{item.label}</span>
            </button>
          ) : (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: isActive(item.path) 
                  ? `linear-gradient(135deg, ${item.color}, ${item.color}88)`
                  : 'transparent',
                border: isActive(item.path) ? `2px solid ${item.color}` : '2px solid transparent',
                borderRadius: 16,
                padding: '10px 16px',
                color: isActive(item.path) ? '#fff' : '#888',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: 12,
                fontWeight: isActive(item.path) ? 800 : 600,
                boxShadow: isActive(item.path) ? `0 4px 15px ${item.color}44` : 'none',
                transform: isActive(item.path) ? 'translateY(-2px)' : 'none'
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 10, letterSpacing: 0.5 }}>{item.label}</span>
            </button>
          )
        ))}
      </nav>
    </>
  );
}
