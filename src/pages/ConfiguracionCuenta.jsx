import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

export default function ConfiguracionCuenta() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [privacidad, setPrivacidad] = useState('publico');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handlePassword = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.changePassword(password);
      setFeedback('Contraseña actualizada');
    } catch (err) {
      setFeedback('Error al cambiar contraseña');
    }
    setLoading(false);
  };

  const handleUbicacion = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await UserService.updateUbicacion(ubicacion);
      setFeedback('Ubicación actualizada');
    } catch (err) {
      setFeedback('Error al cambiar ubicación');
    }
    setLoading(false);
  };

  const handlePrivacidad = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await UserService.updatePrivacidad(privacidad);
      setFeedback('Privacidad actualizada');
    } catch (err) {
      setFeedback('Error al cambiar privacidad');
    }
    setLoading(false);
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar cuenta? Esta acción es irreversible.')) return;
    setLoading(true);
    try {
      await AuthService.deleteAccount();
      setFeedback('Cuenta eliminada');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setFeedback('Error al eliminar cuenta');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await AuthService.logout();
    setLoading(false);
    navigate('/');
  };

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Configuración de Cuenta</h2>
      {feedback && <div style={{ color: '#FFD700', background: '#232323', borderRadius: 8, padding: 12, marginBottom: 16 }}>{feedback}</div>}
      <form onSubmit={handlePassword} style={{ marginBottom: 24 }}>
        <label>Nueva contraseña:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cambiar contraseña</button>
      </form>
      <form onSubmit={handleUbicacion} style={{ marginBottom: 24 }}>
        <label>Ubicación:</label>
        <input type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cambiar ubicación</button>
      </form>
      <form onSubmit={handlePrivacidad} style={{ marginBottom: 24 }}>
        <label>Privacidad:</label>
        <select value={privacidad} onChange={e => setPrivacidad(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }}>
          <option value="publico">Público</option>
          <option value="privado">Privado</option>
        </select>
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cambiar privacidad</button>
      </form>
      <button onClick={handleEliminar} disabled={loading} style={{ background: '#FFD70022', color: '#FFD700', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022', cursor: 'pointer', marginBottom: 24, transition: 'background 0.3s, color 0.3s' }}>Eliminar cuenta</button>
      <button onClick={handleLogout} disabled={loading} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70044', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cerrar sesión</button>
    </div>
  );
}
