import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';


export default function LoginRegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stepMsg, setStepMsg] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const validatePassword = (pw) => pw.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!validateEmail(email)) {
      setError('Email inválido');
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }
    if (isRegister) {
      try {
        const user = await AuthService.register(email, password);
        if (user) {
          setStepMsg('Registro exitoso. Selecciona tu categoría...');
          setTimeout(() => navigate('/seleccionar-categoria'), 1500);
        }
      } catch (err) {
        setError(err.message || 'Error al registrar');
      }
    } else {
      setStepMsg('Verificando usuario...');
      try {
        const user = await AuthService.login(email, password);
        if (user) {
          setStepMsg('Login exitoso. Redirigiendo a Home...');
          setTimeout(() => navigate('/home'), 1500);
        }
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes('not found')) {
          setError('No existe una cuenta con ese email. Redirigiendo al registro...');
          setStepMsg('Redirigiendo al registro...');
          setTimeout(() => { setIsRegister(true); navigate('/seleccionar-categoria'); }, 1500);
        } else {
          setError(err.message || 'Error al iniciar sesión');
          setStepMsg('');
        }
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    setStepMsg('Autenticando con Google...');
    try {
      await AuthService.signInWithGoogle();
      setStepMsg('Autenticación exitosa. Asignando Card...');
      setTimeout(() => {
        navigate('/perfil-card');
        setStepMsg('¡Tu Card de Jugador está lista! Redirigiendo a Home...');
      }, 2000);
      setTimeout(() => navigate('/home'), 5000);
    } catch (err) {
      setError(err.message || 'Error con Google OAuth');
      setStepMsg('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#232323', borderRadius: 18, padding: 40, boxShadow: '0 2px 16px #FFD70044', minWidth: 340, maxWidth: 400 }}>
        <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 32, marginBottom: 24 }}>FutPro Login / Registro</h1>
        {stepMsg && <div style={{ color: '#FFD700', marginBottom: 8 }}>{stepMsg}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18 }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18 }} />
          <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>{isRegister ? 'Registrarse' : 'Iniciar sesión'}</button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', color: '#FFD700', border: 'none', marginTop: 12, fontSize: 16, cursor: 'pointer' }}>
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
        <button onClick={handleGoogle} disabled={loading} style={{ background: '#4285F4', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #4285F488', cursor: 'pointer', marginTop: 18 }}>Continuar con Google</button>
        {error && <div style={{ color: '#FF3333', marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}
