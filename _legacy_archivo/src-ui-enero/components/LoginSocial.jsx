import React, { useState } from 'react';
import CondicionesUsoPanel from './CondicionesUsoPanel.jsx';
import { useAuth } from '../context/AuthContext';
import FutproLogo from './FutproLogo.jsx';
import { Link } from 'react-router-dom';

export default function LoginSocial({ onLoginSuccess }) {
  const { loginWithGoogle, loginWithFacebook } = useAuth();
  const [aceptado, setAceptado] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Valida antigüedad de cuenta (simulado, deberás implementar con datos reales)
  const validarAntiguedad = (user) => {
    if (!user || !user.metadata || !user.metadata.creationTime) return true; // si viene por Supabase OAuth no tendremos metadata
    const creacion = new Date(user.metadata.creationTime);
    const ahora = new Date();
    const diffAnios = (ahora - creacion) / (1000 * 60 * 60 * 24 * 365);
    return diffAnios >= 1;
  };

  const handleLogin = async (proveedor) => {
    setLoading(true);
    setError('');
    try {
      let result;
      if (proveedor === 'google') result = await loginWithGoogle();
      else if (proveedor === 'facebook') result = await loginWithFacebook();
      // Si se redirige por Supabase OAuth, dejamos que el flujo continúe al callback
      if (result && result.redirecting) return;
      if (!result || !result.user) throw new Error('No se pudo obtener usuario');
      if (!validarAntiguedad(result.user)) {
        setError('Tu cuenta debe tener más de 1 año de antigüedad.');
        setLoading(false);
        return;
      }
      onLoginSuccess(result.user);
    } catch (e) {
      setError(e.message || 'Error de autenticación');
    }
    setLoading(false);
  };

  return (
    <div className="login-social-container" style={{ maxWidth: 340, margin: '40px auto', background: '#222', borderRadius: 18, padding: '32px 40px', boxShadow: '0 4px 24px #FFD70055', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <FutproLogo size={64} />
      </div>
      <h2 style={{ color: '#FFD700', marginBottom: 18 }}>Bienvenido a FutPro</h2>
      <CondicionesUsoPanel onAccept={() => setAceptado(true)} />
      <div style={{ margin: '1em 0' }}>
        <button onClick={() => handleLogin('google')} disabled={!aceptado || loading} style={{ width: '100%', marginBottom: 12, background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>
          {loading ? 'Procesando...' : 'Ingresar con Google'}
        </button>
        <button onClick={() => handleLogin('facebook')} disabled={!aceptado || loading} style={{ width: '100%', marginBottom: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>
          {loading ? 'Procesando...' : 'Ingresar con Facebook'}
        </button>
      </div>
      <div style={{ margin: '12px 0' }}>
        <Link to="/recuperar-password" style={{ color: '#FFD700', textDecoration: 'underline', fontSize: 15 }}>Olvidé mi contraseña</Link>
      </div>
      <div style={{ margin: '12px 0' }}>
        <span style={{ color: '#FFD700', fontSize: 15 }}>¿No tienes cuenta? </span>
        <Link to="/registro" style={{ color: '#FFD700', textDecoration: 'underline', fontWeight: 'bold', fontSize: 15 }}>Regístrate</Link>
      </div>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
}
