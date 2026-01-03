import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const gold = '#FFD700';
  const black = '#222';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // TODO: implementar login real
    alert('Login: ' + email);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${black} 0%, #333 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
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
        {/* Logo */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚽</div>
          <h1 style={{ color: gold, margin: 0, fontSize: '32px', fontWeight: 'bold' }}>FutPro</h1>
          <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>Plataforma de Fútbol</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#F44336',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} style={{ marginBottom: 20 }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '8px',
              border: `1px solid ${gold}`,
              background: '#232323',
              color: gold,
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '8px',
              border: `1px solid ${gold}`,
              background: '#232323',
              color: gold,
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: gold,
              color: black,
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '12px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Google */}
        <button
          onClick={() => alert('Google login - TODO')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            background: '#4285f4',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: loading ? 0.7 : 1
          }}
        >
          🌐 Continuar con Google
        </button>

        {/* Crear Usuario */}
        <button
          onClick={() => navigate('/registro-nuevo')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            marginBottom: '12px',
            opacity: loading ? 0.7 : 1
          }}
        >
          👤 No tienes cuenta? Crear Usuario
        </button>

        {/* Olvidaste contraseña */}
        <button
          onClick={() => alert('Recuperar contraseña - TODO')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            color: gold,
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textDecoration: 'underline',
            opacity: loading ? 0.7 : 1
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  );
}
