import React from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment.js';

export default function RegistroSimple() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const config = getConfig();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: config.oauthCallbackUrl
        }
      });
      
      if (error) {
        console.error('❌ Error Google:', error);
      } else {
        console.log('✅ Google OAuth iniciado');
      }
    } catch (error) {
      console.error('❌ Error Google:', error);
    }
  };

  const handleCrearUsuario = () => {
    console.log('🚀 Navegando a registro completo...');
    try {
      navigate('/registro');
    } catch (error) {
      console.error('❌ Error navegación:', error);
      try {
        window.location.href = '/registro';
      } catch (fallbackError) {
        window.location.href = window.location.origin + '/registro';
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #222 0%, #333 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#1a1a1a',
        border: '2px solid #FFD700',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚽</div>
          <h1 style={{ color: '#FFD700', margin: 0, fontSize: '24px' }}>FutPro</h1>
          <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>Plataforma de Fútbol</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            background: '#4285f4',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <span>🌐</span>Continuar con Google
        </button>

        <button
          onClick={handleCrearUsuario}
          style={{
            width: '100%',
            padding: '12px',
            background: '#4285f4',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <span>👤</span>Crear Usuario
        </button>
      </div>
    </div>
  );
}