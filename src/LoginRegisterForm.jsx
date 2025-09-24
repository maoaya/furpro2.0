import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginRegisterForm = () => {
  const { loginWithGoogle, loginWithFacebook, user, loading, logout } = useAuth();
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    console.log('🚀 Iniciando login con Google...');
    setError('');
    setMensaje('Conectando con Google...');
    
    try {
      const result = await loginWithGoogle();
      
      if (result?.error) {
        console.error('❌ Error en Google login:', result.error);
        setError(result.error);
        setMensaje('');
      } else if (result?.redirecting) {
        console.log('🔄 Redirigiendo a Google...');
        setMensaje('Redirigiendo a Google para autenticación...');
        setError('');
      } else {
        console.log('✅ Proceso Google iniciado');
        setMensaje('Proceso de autenticación iniciado...');
      }
    } catch (error) {
      console.error('💥 Error inesperado en Google login:', error);
      setError('Error de conexión. Intenta de nuevo.');
      setMensaje('');
    }
  };

  const handleFacebookLogin = async () => {
    console.log('🚀 Iniciando login con Facebook...');
    setError('');
    setMensaje('Conectando con Facebook...');
    
    try {
      const result = await loginWithFacebook();
      
      if (result?.error) {
        console.error('❌ Error en Facebook login:', result.error);
        setError(result.error);
        setMensaje('');
      } else if (result?.redirecting) {
        console.log('🔄 Redirigiendo a Facebook...');
        setMensaje('Redirigiendo a Facebook para autenticación...');
        setError('');
      } else {
        console.log('✅ Proceso Facebook iniciado');
        setMensaje('Proceso de autenticación iniciado...');
      }
    } catch (error) {
      console.error('💥 Error inesperado en Facebook login:', error);
      setError('Error de conexión. Intenta de nuevo.');
      setMensaje('');
    }
  };

  const irARegistroCompleto = () => {
    console.log('📝 Navegando a registro completo...');
    navigate('/registro');
  };

  if (user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#FFD700' }}>
        <h2>¡Bienvenido, {user.user_metadata?.full_name || user.email}!</h2>
        <button
          onClick={logout}
          style={{
            background: '#F44336',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '400px',
        width: '100%',
        background: 'rgba(34, 34, 34, 0.95)', 
        borderRadius: '20px', 
        padding: '40px', 
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)', 
        textAlign: 'center',
        border: '2px solid #333'
      }}>
        {/* Logo y título */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            margin: '0 0 8px 0',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ⚽ FutPro
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#ccc', 
            margin: 0 
          }}>
            Tu plataforma de fútbol
          </p>
        </div>

        {/* Mensajes de estado */}
        {mensaje && (
          <div style={{ 
            color: '#FFD700', 
            marginBottom: '20px',
            padding: '12px',
            background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            {mensaje}
          </div>
        )}

        {/* Botones de login social */}
        <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 20px',
              border: 'none',
              borderRadius: '12px',
              background: loading ? '#666' : '#db4437',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1
            }}
            onMouseOver={(e) => !loading && (e.target.style.background = '#c23321')}
            onMouseOut={(e) => !loading && (e.target.style.background = '#db4437')}
          >
            <span style={{ fontSize: '20px' }}>🔍</span>
            {loading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          <button 
            type="button" 
            onClick={handleFacebookLogin} 
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 20px',
              border: 'none',
              borderRadius: '12px',
              background: loading ? '#666' : '#4267B2',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1
            }}
            onMouseOver={(e) => !loading && (e.target.style.background = '#365899')}
            onMouseOut={(e) => !loading && (e.target.style.background = '#4267B2')}
          >
            <span style={{ fontSize: '20px' }}>📘</span>
            {loading ? 'Conectando...' : 'Continuar con Facebook'}
          </button>
        </div>

        {/* Separador */}
        <div style={{ 
          margin: '24px 0', 
          color: '#666',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#444' }}></div>
          <span>o</span>
          <div style={{ flex: 1, height: '1px', background: '#444' }}></div>
        </div>

        {/* Botón de registro completo */}
        <button
          onClick={irARegistroCompleto}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 20px',
            background: 'transparent',
            color: '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.6 : 1
          }}
          onMouseOver={(e) => !loading && (e.target.style.background = '#FFD700', e.target.style.color = '#000')}
          onMouseOut={(e) => !loading && (e.target.style.background = 'transparent', e.target.style.color = '#FFD700')}
        >
          📝 Registro Completo
        </button>

        {/* Mensaje de error */}
        {error && (
          <div style={{ 
            color: '#F44336', 
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(244, 67, 54, 0.1)',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Información adicional */}
        <div style={{ 
          marginTop: '24px', 
          padding: '16px',
          background: 'rgba(255, 215, 0, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <p style={{ 
            color: '#FFD700', 
            fontSize: '12px', 
            margin: 0,
            lineHeight: '1.4'
          }}>
            � Al continuar, aceptas nuestros términos y crearás tu perfil de jugador en FutPro
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterForm;
