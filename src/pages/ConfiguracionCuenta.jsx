import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  handlePassword as stubHandlePassword,
  handleUbicacion as stubHandleUbicacion,
  handlePrivacidad as stubHandlePrivacidad,
  handleEliminar as stubHandleEliminar,
  handleLogout as stubHandleLogout
} from '../stubs/configuracionCuentaFunctions';

export default function ConfiguracionCuenta() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [privacidad, setPrivacidad] = useState('publico');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');


  // Las funciones ahora se importan desde el stub y se usan en los handlers

  // Handlers con integración de stubs y logs
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await stubHandlePassword(password);
    setFeedback('Contraseña cambiada (stub)');
    console.log('[INTEGRACIÓN STUB] handlePassword ejecutado (ConfiguracionCuenta.jsx)', password);
    setLoading(false);
  };
  const handleUbicacionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await stubHandleUbicacion(ubicacion);
    setFeedback('Ubicación cambiada (stub)');
    console.log('[INTEGRACIÓN STUB] handleUbicacion ejecutado (ConfiguracionCuenta.jsx)', ubicacion);
    setLoading(false);
  };
  const handlePrivacidadSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await stubHandlePrivacidad(privacidad);
    setFeedback('Privacidad cambiada (stub)');
    console.log('[INTEGRACIÓN STUB] handlePrivacidad ejecutado (ConfiguracionCuenta.jsx)', privacidad);
    setLoading(false);
  };
  const handleEliminarClick = async () => {
    setLoading(true);
    await stubHandleEliminar(navigate);
    setFeedback('Cuenta eliminada (stub)');
    console.log('[INTEGRACIÓN STUB] handleEliminar ejecutado (ConfiguracionCuenta.jsx)');
    setLoading(false);
  };
  const handleLogoutClick = async () => {
    setLoading(true);
    await stubHandleLogout(navigate);
    setFeedback('Sesión cerrada (stub)');
    console.log('[INTEGRACIÓN STUB] handleLogout ejecutado (ConfiguracionCuenta.jsx)');
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Configuración de Cuenta</h2>
      {feedback && <div style={{ color: '#FFD700', background: '#232323', borderRadius: 8, padding: 12, marginBottom: 16 }}>{feedback}</div>}
      <form onSubmit={handlePasswordSubmit} style={{ marginBottom: 24 }}>
        <label>Nueva contraseña:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cambiar contraseña</button>
      </form>
      <form onSubmit={handleUbicacionSubmit} style={{ marginBottom: 24 }}>
        <label>Ubicación:</label>
        <input type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cambiar ubicación</button>
      </form>
      <form onSubmit={handlePrivacidadSubmit} style={{ marginBottom: 24 }}>
        <label>Privacidad:</label>
        <select value={privacidad} onChange={e => setPrivacidad(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }}>
          <option value="publico">Público</option>
          <option value="privado">Privado</option>
        </select>
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cambiar privacidad</button>
      </form>
      <button onClick={handleEliminarClick} disabled={loading} style={{ background: '#FFD70022', color: '#FFD700', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022', cursor: 'pointer', marginBottom: 24, transition: 'background 0.3s, color 0.3s' }}>Eliminar cuenta</button>
      <button onClick={handleLogoutClick} disabled={loading} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70044', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cerrar sesión</button>
    </div>
  );
}
