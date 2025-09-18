// ...existing code...
import React, { useState } from 'react';
import { supabase } from '../config/supabase';
const gold = '#FFD700';
const black = '#222';

export default function LoginRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSocial = async (provider) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) setError(error.message);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleEmailForm = () => {
    setShowEmailForm(true);
    setIsRegister(false);
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('¡Ingreso exitoso!');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('¡Registro exitoso!');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', minWidth: 320, textAlign: 'center' }}>
        <img src="/logo192.png" alt="FutPro Logo" style={{ width: 80, marginBottom: 24 }} />
        <h1>Acceso FutPro</h1>
        <button
          onClick={() => handleLoginSocial('google')}
          disabled={loading}
          style={{ width: '100%', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 8, padding: 12, fontWeight: 'bold', fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
        >
          <img src="/google-logo.png" alt="Google" style={{ width: 24, height: 24 }} />
          Ingresar con Google
        </button>
        <button
          onClick={() => handleLoginSocial('facebook')}
          disabled={loading}
          style={{ width: '100%', background: '#1877f3', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 'bold', fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
        >
          <img src="/facebook-logo.png" alt="Facebook" style={{ width: 24, height: 24 }} />
          Ingresar con Facebook
        </button>
        <button
          onClick={handleEmailForm}
          disabled={loading}
          style={{ width: '100%', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 8, padding: 12, fontWeight: 'bold', fontSize: 18, marginBottom: 16, display: 'block' }}
        >
          Ingresar con Email
        </button>
        {showEmailForm && (
          <form onSubmit={isRegister ? handleRegister : handleLogin} style={{ marginBottom: 16 }}>
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              type="email"
              autoComplete="email"
            />
            <input
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              type="password"
              autoComplete="current-password"
            />
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button
                type="submit"
                disabled={loading}
                style={{ flex: 1, background: black, color: gold, border: '2px solid ' + gold, borderRadius: 8, padding: '10px 0', fontWeight: 'bold', fontSize: 16 }}
              >
                {isRegister ? 'Registrarse' : 'Ingresar'}
              </button>
              <button
                type="button"
                disabled={loading}
                style={{ flex: 1, background: '#fff', color: black, border: '1px solid #ccc', borderRadius: 8, padding: '10px 0', fontWeight: 'bold', fontSize: 16 }}
                onClick={() => setIsRegister(r => !r)}
              >
                {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              </button>
            </div>
          </form>
        )}
        <a href="/recuperar" style={{ color: black, textDecoration: 'underline', display: 'block', marginBottom: 16 }}>¿Olvidaste tu contraseña?</a>
        {loading && <div style={{ color: gold }}>Procesando...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green', fontWeight: 'bold' }}>{success}</div>}
      </div>
    </div>
  );
}
// ...existing code...
