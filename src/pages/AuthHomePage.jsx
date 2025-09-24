import React, { useState, useEffect } from 'react';
import { conexionEfectiva } from '../services/conexionEfectiva.js';
import { flujoCompletoRegistro } from '../services/flujoCompletoRegistro.js';
import FutproLogo from '../components/FutproLogo.jsx';

export default function AuthHomePage() {
  const [activeTab, setActiveTab] = useState('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Funciones OAuth - Flujo Completo Mejorado
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    setMensaje('🚀 Iniciando registro completo con Google...');
    
    try {
      console.log('🔗 INICIANDO FLUJO COMPLETO CON GOOGLE...');
      const resultado = await flujoCompletoRegistro.iniciarRegistroCompleto('google');
      
      if (resultado.success) {
        setMensaje('✅ ¡Conexión establecida! Redirigiendo a Google...');
        // La redirección se maneja automáticamente por OAuth
      } else {
        setError(`Error en registro: ${resultado.error}`);
        setLoading(false);
      }
      
    } catch (error) {
      console.error('❌ Error en flujo completo:', error);
      setError('Error al iniciar registro con Google');
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    setError('');
    setMensaje('🚀 Iniciando registro completo con Facebook...');
    
    try {
      console.log('🔗 INICIANDO FLUJO COMPLETO CON FACEBOOK...');
      const resultado = await flujoCompletoRegistro.iniciarRegistroCompleto('facebook');
      
      if (resultado.success) {
        setMensaje('✅ ¡Conexión establecida! Redirigiendo a Facebook...');
        // La redirección se maneja automáticamente por OAuth
      } else {
        setError(`Error en registro: ${resultado.error}`);
        setLoading(false);
      }
      
    } catch (error) {
      console.error('❌ Error en flujo completo:', error);
      setError('Error al iniciar registro con Facebook');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(42, 42, 42, 0.95)',
        border: '2px solid #FFD700',
        borderRadius: '20px',
        padding: '40px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Logo */}
        <div style={{
          background: '#FFD700',
          borderRadius: '15px',
          width: '80px',
          height: '80px',
          margin: '0 auto 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px'
        }}>
          ⚽
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          marginBottom: '30px',
          background: '#333',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              background: activeTab === 'login' ? '#555' : 'transparent',
              color: activeTab === 'login' ? '#fff' : '#ccc',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Ingresar
          </button>
          <button
            onClick={() => setActiveTab('register')}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              background: activeTab === 'register' ? '#FFD700' : 'transparent',
              color: activeTab === 'register' ? '#000' : '#ccc',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Contenido del tab Registrarse */}
        {activeTab === 'register' && (
          <div>
            <p style={{
              color: '#ccc',
              marginBottom: '25px',
              fontSize: '14px'
            }}>
              Continúa con
            </p>

            {/* Mensajes */}
            {error && (
              <div style={{
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid #ff4444',
                color: '#ff8888',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {mensaje && (
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid #00ff88',
                color: '#88ffaa',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {mensaje}
              </div>
            )}

            {/* Botón Google */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '15px',
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                color: '#333',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '18px' }}>🟢</span>
              Google
            </button>

            {/* Botón Facebook */}
            <button
              onClick={handleFacebookAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '20px',
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                color: '#333',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '18px' }}>📘</span>
              Facebook
            </button>

            <p style={{
              color: '#888',
              fontSize: '12px',
              marginTop: '20px'
            }}>
              Tras registrarte te llevamos al formulario de inscripción.
            </p>
          </div>
        )}

        {/* Contenido del tab Ingresar */}
        {activeTab === 'login' && (
          <div>
            <p style={{
              color: '#ccc',
              marginBottom: '25px',
              fontSize: '14px'
            }}>
              Continúa con
            </p>

            {/* Botón Google */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '15px',
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                color: '#333',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <span style={{ fontSize: '18px' }}>🟢</span>
              Google
            </button>

            {/* Botón Facebook */}
            <button
              onClick={handleFacebookAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                color: '#333',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <span style={{ fontSize: '18px' }}>📘</span>
              Facebook
            </button>
          </div>
        )}
      </div>
    </div>
  );
}