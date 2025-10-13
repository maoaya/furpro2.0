import React from 'react';

// Componente de login de emergencia - render puro sin dependencias
export default function LoginFallback() {
  const gold = '#FFD700';
  const black = '#222';

  const handleGoogleLogin = () => {
    window.location.href = 'https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://futpro.vip/auth/callback';
  };

  const handleCreateUser = () => {
    window.location.href = '/registro-nuevo';
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
          onClick={handleCreateUser}
          style={{ 
            width: '100%', 
            padding: '15px', 
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            fontSize: '16px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            marginTop: '20px'
          }}
        >
          <span>👤</span>Crear Usuario
        </button>
      </div>
    </div>
  );
}