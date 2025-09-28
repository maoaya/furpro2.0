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
  const { login, loginWithGoogle, loginWithFacebook, user, loading, logout } = useAuth();
  const [error, setError] = useState('');
  const [tab, setTab] = useState('login'); // login | register
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  // Login con email/password
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        console.log('✅ Login exitoso, redirigiendo...');
        localStorage.setItem('postLoginRedirect', '/home');
        // La redirección se maneja en FutProAppDefinitivo
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
      console.error('Error en login:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Definir destino tras login según pestaña activa
  const setRedirectTarget = () => {
    const target = tab === 'register' ? '/home' : '/home';
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

          {tab === 'login' && (
            <div style={{ marginTop: 14 }}>
              {/* Formulario de login con email/password */}
              <form onSubmit={handleEmailLogin} style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#FFD700',
                    color: '#222',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>

              <div style={{ color: '#888', fontSize: 12, textAlign: 'center', margin: '10px 0' }}>o continúa con</div>
              <button type="button" className="btn-outline" style={{ width: '100%', marginBottom: 10 }} onClick={handleGoogleLogin} disabled={loading}>
                <i className="fab fa-google"></i> Google
              </button>
              <button type="button" className="btn-outline" style={{ width: '100%' }} onClick={handleFacebookLogin} disabled={loading}>
                <i className="fab fa-facebook"></i> Facebook
              </button>
              {error && <div style={{ color: '#ff6b6b', marginTop: 8, fontSize: '14px', textAlign: 'center' }}>{error}</div>}
            </div>
          )}

          {tab === 'register' && (
            <div style={{ marginTop: 14 }}>
              <div style={{ color: '#888', fontSize: 12, textAlign: 'center', margin: '10px 0' }}>Opciones de registro</div>
              
              {/* Registro completo */}
              <button 
                type="button" 
                onClick={() => window.location.href = '/registro'}
                style={{ 
                  width: '100%', 
                  marginBottom: 10, 
                  padding: '12px',
                  background: '#FFD700', 
                  color: '#222', 
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                📝 Registro Completo
              </button>
              
              <div style={{ color: '#666', fontSize: 11, textAlign: 'center', margin: '8px 0' }}>o continúa con</div>
              
              {/* OAuth buttons */}
              <button type="button" className="btn-outline" style={{ width: '100%', marginBottom: 10 }} onClick={handleGoogleLogin} disabled={loading}>
                <i className="fab fa-google"></i> Google
              </button>
              <button type="button" className="btn-outline" style={{ width: '100%' }} onClick={handleFacebookLogin} disabled={loading}>
                <i className="fab fa-facebook"></i> Facebook
              </button>
              {error && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{error}</div>}
              
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <span style={{ color: '#aaa', fontSize: 12 }}>
                  Recomendamos el registro completo para mejor experiencia
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoginRegisterForm;
