import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getConfig } from '../config/environment.js';

export default function OAuthLiveTest() {
  const { loginWithGoogle } = useAuth();
  const config = getConfig();

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error('OAuth error:', e);
      alert('Error OAuth: ' + (e?.message || 'ver consola'));
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#111', color: '#FFD700', fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 42 }}>⚽ FutPro · Live OAuth Test</div>
        <div style={{ marginTop: 8, opacity: 0.8 }}>
          Dominio detectado: <b>{window.location.origin}</b>
        </div>
        <div style={{ marginTop: 4, opacity: 0.8 }}>
          Callback configurado: <code>{config.oauthCallbackUrl}</code>
        </div>
        <button onClick={handleGoogle} style={{
          marginTop: 20, padding: '12px 20px', background: '#FFD700', color: '#111',
          border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer'
        }}>Iniciar sesión con Google</button>
        <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
          Este botón dispara el flujo real de OAuth en este dominio.
        </div>
      </div>
    </div>
  );
}
