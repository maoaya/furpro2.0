import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const LoginRegisterForm = () => {
  const { loginWithGoogle, loginWithFacebook, user, loading, logout } = useAuth();
  const [error] = useState('');

  return (
    <div className="login-register-form" style={{ maxWidth: 340, margin: '40px auto', background: '#222', borderRadius: 18, padding: '32px 40px', boxShadow: '0 4px 24px #FFD70055', textAlign: 'center' }}>
      {/* Logo de FutPro */}
      <div style={{ marginBottom: 24 }}>
        <img 
          src="/images/futpro-logo.png" 
          alt="FutPro Logo" 
          style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
          }} 
        />
      </div>
      <h2 style={{ color: '#FFD700', marginBottom: 18 }}>Iniciar sesión</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {user ? (
        <>
          <p style={{ color: '#fff' }}>Bienvenido, {user.email || user.displayName}</p>
          <button className="btn-primary" style={{ width: '100%', marginTop: 18 }} onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <button type="button" className="btn-outline" style={{ width: '100%', marginBottom: 12 }} onClick={loginWithGoogle} disabled={loading}>
            <i className="fab fa-google"></i> Ingresar con Google
          </button>
          <button type="button" className="btn-outline" style={{ width: '100%', marginBottom: 12 }} onClick={loginWithFacebook} disabled={loading}>
            <i className="fab fa-facebook"></i> Ingresar con Facebook
          </button>
        </>
      )}
    </div>
  );
};

export default LoginRegisterForm;
