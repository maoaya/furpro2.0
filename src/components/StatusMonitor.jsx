import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function StatusMonitor() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [authData, setAuthData] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Monitorear cambios en localStorage
    const checkAuthData = () => {
      try {
        const authCompleted = localStorage.getItem('authCompleted');
        const userRegistrado = localStorage.getItem('userRegistrado');
        const authTimestamp = localStorage.getItem('authTimestamp');
        
        setAuthData({
          authCompleted,
          userRegistrado: userRegistrado ? JSON.parse(userRegistrado) : null,
          authTimestamp,
          currentPath: location.pathname,
          userFromContext: user ? {
            id: user.id,
            email: user.email,
            provider: user.app_metadata?.provider
          } : null
        });
      } catch (error) {
        console.error('Error checking auth data:', error);
      }
    };

    checkAuthData();
    
    // Verificar cada 2 segundos
    const interval = setInterval(checkAuthData, 2000);
    
    return () => clearInterval(interval);
  }, [user, location.pathname]);

  // Solo mostrar en desarrollo o cuando hay problemas
  const shouldShow = process.env.NODE_ENV === 'development' || 
                    !user || 
                    !authData.authCompleted;

  if (!shouldShow) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#1a1a1a',
      border: '2px solid #FFD700',
      borderRadius: '8px',
      padding: '12px',
      color: '#FFD700',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{ fontWeight: 'bold' }}>🔍 FutPro Status</span>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'transparent',
            border: '1px solid #FFD700',
            color: '#FFD700',
            borderRadius: '4px',
            padding: '2px 6px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          {showDetails ? '🔼' : '🔽'}
        </button>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Estado:</strong>{' '}
        <span style={{ 
          color: user ? '#4CAF50' : '#f44336'
        }}>
          {loading ? '⏳ Cargando...' : user ? '✅ Autenticado' : '❌ No autenticado'}
        </span>
      </div>

      {showDetails && (
        <div style={{ fontSize: '11px', color: '#ccc' }}>
          <div><strong>Ruta:</strong> {authData.currentPath}</div>
          <div><strong>Auth Completed:</strong> {authData.authCompleted || 'No'}</div>
          
          {user && (
            <div style={{ marginTop: '8px', padding: '6px', background: '#333', borderRadius: '4px' }}>
              <div><strong>Usuario Context:</strong></div>
              <div>📧 {user.email}</div>
              <div>🆔 {user.id?.substring(0, 8)}...</div>
              {user.app_metadata?.provider && (
                <div>🔑 {user.app_metadata.provider}</div>
              )}
            </div>
          )}

          {authData.userRegistrado && (
            <div style={{ marginTop: '8px', padding: '6px', background: '#2d3748', borderRadius: '4px' }}>
              <div><strong>LocalStorage:</strong></div>
              <div>📧 {authData.userRegistrado.email}</div>
              <div>👤 {authData.userRegistrado.nombre}</div>
              {authData.userRegistrado.provider && (
                <div>🔑 {authData.userRegistrado.provider}</div>
              )}
            </div>
          )}

          {authData.authTimestamp && (
            <div style={{ marginTop: '6px', fontSize: '10px' }}>
              <strong>Auth Time:</strong> {new Date(authData.authTimestamp).toLocaleTimeString()}
            </div>
          )}

          <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '10px'
              }}
            >
              🗑️ Clear
            </button>
            <button
              onClick={() => {
                try {
                  window.location.href = '/home';
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '10px'
              }}
            >
              🏠 Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}