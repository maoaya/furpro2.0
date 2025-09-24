import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';

const TabButton = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    flex: 1,
    padding: '10px 12px',
    background: active ? '#2d2d2d' : 'transparent',
    color: active ? '#FFD700' : '#bbb',
    border: '1px solid #333',
    borderBottom: active ? '2px solid #FFD700' : '1px solid #333',
    cursor: 'pointer'
  }}>{children}</button>
);

const LoginRegisterForm = () => {
  const { loginWithGoogle, loginWithFacebook, user, loading, logout } = useAuth();
  const [error, setError] = useState('');
  const [tab, setTab] = useState('login'); // login | register

  // Definir destino tras login según pestaña activa
  const setRedirectTarget = () => {
    const target = tab === 'register' ? '/validar-usuario' : '/dashboard';
    localStorage.setItem('postLoginRedirect', target);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setRedirectTarget();
    const res = await loginWithGoogle();
    if (res?.error) setError(res.error);
  };

  const handleFacebookLogin = async () => {
    setError('');
    setRedirectTarget();
    const res = await loginWithFacebook();
    if (res?.error) setError(res.error);
  };

  return (
    <div className="login-register-form" style={{ maxWidth: 360, margin: '40px auto', background: '#222', borderRadius: 18, padding: '24px 24px 28px', boxShadow: '0 4px 24px #FFD70055', textAlign: 'center' }}>
      {/* Logo de FutPro */}
      <div style={{ marginBottom: 18 }}>
        <img 
          src="/images/futpro-logo.svg" 
          alt="FutPro Logo" 
          style={{ width: 72, height: 72, borderRadius: 12, boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)' }} 
        />
      </div>

      {user ? (
        <>
          <h3 style={{ color: '#FFD700', marginBottom: 8 }}>Bienvenido</h3>
          <p style={{ color: '#ddd', marginBottom: 16 }}>{user.email || user.displayName}</p>
          <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={logout} disabled={loading}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <TabButton active={tab === 'login'} onClick={() => setTab('login')}>Ingresar</TabButton>
            <TabButton active={tab === 'register'} onClick={() => setTab('register')}>Registrarse</TabButton>
          </div>

          {/* Eliminado formulario de email/contraseña; solo botones sociales */}

          {(tab === 'login' || tab === 'register') && (
            <div style={{ marginTop: 14 }}>
              <div style={{ color: '#888', fontSize: 12, textAlign: 'center', margin: '10px 0' }}>Continúa con</div>
              <button type="button" className="btn-outline" style={{ width: '100%', marginBottom: 10 }} onClick={handleGoogleLogin} disabled={loading}>
                <i className="fab fa-google"></i> Google
              </button>
              <button type="button" className="btn-outline" style={{ width: '100%' }} onClick={handleFacebookLogin} disabled={loading}>
                <i className="fab fa-facebook"></i> Facebook
              </button>
              {error && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{error}</div>}
              {tab === 'register' && (
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <span style={{ color: '#aaa', fontSize: 12 }}>Tras registrarte te llevamos al formulario de inscripción.</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoginRegisterForm;
