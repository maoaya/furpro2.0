import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

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
  const { loginWithGoogle, loginWithFacebook, signInWithEmail, signUpWithEmail, resetPassword, user, loading, logout } = useAuth();
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [tab, setTab] = useState('login'); // login | register | recover
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (tab === 'login') {
      const res = await signInWithEmail(email, password);
      if (res?.error) setError(res.error);
    } else if (tab === 'register') {
      const res = await signUpWithEmail(email, password);
      if (res?.error) setError(res.error);
      else setInfo('Revisa tu correo para confirmar la cuenta.');
    } else if (tab === 'recover') {
      const res = await resetPassword(email);
      if (res?.error) setError(res.error);
      else setInfo('Te enviamos un enlace para restablecer tu contraseña.');
    }
  };

  return (
    <div className="login-register-form" style={{ maxWidth: 360, margin: '40px auto', background: '#222', borderRadius: 18, padding: '24px 24px 28px', boxShadow: '0 4px 24px #FFD70055', textAlign: 'center' }}>
      {/* Logo de FutPro */}
      <div style={{ marginBottom: 18 }}>
        <img 
          src="/images/futpro-logo.png" 
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
            <TabButton active={tab === 'recover'} onClick={() => setTab('recover')}>Recuperar</TabButton>
          </div>

          {(tab === 'login' || tab === 'register' || tab === 'recover') && (
            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', color: '#bbb', fontSize: 12, marginBottom: 6 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #333', background: '#1a1a1a', color: '#fff' }} />
              </div>
              {tab !== 'recover' && (
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', color: '#bbb', fontSize: 12, marginBottom: 6 }}>Contraseña</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required={tab !== 'recover'} placeholder="••••••••"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #333', background: '#1a1a1a', color: '#fff' }} />
                </div>
              )}

              {error && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</div>}
              {info && <div style={{ color: '#8bd86b', marginBottom: 8 }}>{info}</div>}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 6 }}>
                {tab === 'login' ? 'Ingresar' : tab === 'register' ? 'Crear cuenta' : 'Enviar enlace'}
              </button>
            </form>
          )}

          {tab === 'login' && (
            <div style={{ marginTop: 14 }}>
              <div style={{ color: '#888', fontSize: 12, textAlign: 'center', margin: '10px 0' }}>o continúa con</div>
              <button type="button" className="btn-outline" style={{ width: '100%', marginBottom: 10 }} onClick={loginWithGoogle} disabled={loading}>
                <i className="fab fa-google"></i> Google
              </button>
              <button type="button" className="btn-outline" style={{ width: '100%' }} onClick={loginWithFacebook} disabled={loading}>
                <i className="fab fa-facebook"></i> Facebook
              </button>
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <a href="#" onClick={(e)=>{e.preventDefault(); setTab('recover')}} style={{ color: '#aaa', fontSize: 12 }}>¿Olvidaste tu contraseña?</a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoginRegisterForm;
