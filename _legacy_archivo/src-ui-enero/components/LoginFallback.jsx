import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function LoginFallback() {
  const gold = '#FFD700';
  const black = '#222';
  const { login, loginWithGoogle, user, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
      if (user) navigate('/home');
    }, [user, navigate]);

    const handleLogin = async (e) => {
      e.preventDefault();
      setFormError(null);
      setFormLoading(true);
      const res = await login(email, password);
      setFormLoading(false);
      if (!res.success) setFormError(res.error || 'Error al iniciar sesión');
    };

    const handleGoogleLogin = async () => {
      setFormError(null);
      setFormLoading(true);
      await loginWithGoogle();
      setFormLoading(false);
    };

    const handleCreateUser = () => {
      navigate('/registro-nuevo');
    };

    const handleForgotPassword = () => {
      navigate('/recuperar-password');
    };

    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${black} 0%, #333 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: '#1a1a1a',
          border: `2px solid ${gold}`,
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: `0 10px 30px rgba(255, 215, 0, 0.3)`
        }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚽</div>
            <h1 style={{ color: gold, margin: 0, fontSize: '24px' }}>FutPro</h1>
            <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>Plataforma de Fútbol</p>
          </div>
          <form onSubmit={handleLogin} style={{ marginBottom: 18 }}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #FFD700',
                background: '#232323',
                color: '#FFD700',
                fontSize: '16px'
              }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #FFD700',
                background: '#232323',
                color: '#FFD700',
                fontSize: '16px'
              }}
            />
            <button
              type="submit"
              disabled={formLoading || loading}
              style={{
                width: '100%',
                padding: '12px',
                background: gold,
                color: black,
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: formLoading || loading ? 'not-allowed' : 'pointer',
                marginBottom: '8px',
                opacity: formLoading || loading ? 0.7 : 1
              }}
            >
              {formLoading || loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </form>
          <button
            onClick={handleGoogleLogin}
            disabled={formLoading || loading}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              background: '#4285f4',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: formLoading || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: formLoading || loading ? 0.7 : 1
            }}
          >
            <span>🌐</span>Continuar con Google
          </button>
          <button
            onClick={handleCreateUser}
            disabled={formLoading || loading}
            style={{
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: formLoading || loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
              marginTop: '20px',
              opacity: formLoading || loading ? 0.7 : 1
            }}
          >
            <span>👤</span>Crear Usuario
          </button>
          <button
            onClick={handleForgotPassword}
            disabled={formLoading || loading}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              color: gold,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: formLoading || loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              textDecoration: 'underline',
              opacity: formLoading || loading ? 0.7 : 1
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
          {(formError || error) && (
            <div style={{ color: '#F44336', marginTop: 16, fontWeight: 'bold' }}>
              {formError || error}
            </div>
          )}
        </div>
      </div>
    );
  }