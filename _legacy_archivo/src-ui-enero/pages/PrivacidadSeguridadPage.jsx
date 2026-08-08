import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#181818';

export default function PrivacidadSeguridadPage({ usuario }) {
  // Estado de configuración
  const [privacidad, setPrivacidad] = useState('publico');
  const [notificaciones, setNotificaciones] = useState({ email: true, push: true });
  const [descargando, setDescargando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [cambiandoPass, setCambiandoPass] = useState(false);
  const [nuevaPass, setNuevaPass] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Handlers simulados (conectar a backend en iteración 2)
  // Cambiar privacidad
  const handlePrivacidad = async e => {
    const value = e.target.value;
    setPrivacidad(value);
    setMensaje('');
    try {
      const res = await fetch('/api/user/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privacidad: value }),
        credentials: 'include',
      });
      if (res.ok) setMensaje('Privacidad actualizada');
    } catch {}
  };

  // Cambiar notificaciones
  const handleNotif = async e => {
    const next = { ...notificaciones, [e.target.name]: e.target.checked };
    setNotificaciones(next);
    setMensaje('');
    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
        credentials: 'include',
      });
      if (res.ok) setMensaje('Notificaciones actualizadas');
    } catch {}
  };

  // Descargar datos
  const handleDescargar = async () => {
    setDescargando(true);
    setMensaje('');
    try {
      const res = await fetch('/api/user/data', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.data) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mis_datos_futpro.json';
        a.click();
        setMensaje('Descarga lista');
      }
    } catch { setMensaje('Error al descargar'); }
    setDescargando(false);
  };

  // Eliminar cuenta
  const handleEliminar = async () => {
    setEliminando(true);
    setMensaje('');
    try {
      const res = await fetch('/api/user', { method: 'DELETE', credentials: 'include' });
      if (res.ok) setMensaje('Cuenta eliminada');
    } catch { setMensaje('Error al eliminar'); }
    setEliminando(false);
  };

  // Cambiar contraseña
  const handleCambiarPass = async () => {
    setCambiandoPass(true);
    setMensaje('');
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: nuevaPass }),
        credentials: 'include',
      });
      if (res.ok) setMensaje('Contraseña cambiada');
    } catch { setMensaje('Error al cambiar contraseña'); }
    setCambiandoPass(false);
    setNuevaPass('');
  };

  return (
    <div style={{ background: black, minHeight: '100vh', color: gold, padding: 32, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Privacidad y Seguridad</h1>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Visibilidad de perfil</h2>
        <label style={{ marginRight: 16 }}>
          <input type="radio" name="privacidad" value="publico" checked={privacidad==='publico'} onChange={handlePrivacidad} /> Público
        </label>
        <label>
          <input type="radio" name="privacidad" value="privado" checked={privacidad==='privado'} onChange={handlePrivacidad} /> Privado
        </label>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Notificaciones</h2>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <input type="checkbox" name="email" checked={notificaciones.email} onChange={handleNotif} /> Email
        </label>
        <label style={{ display: 'block' }}>
          <input type="checkbox" name="push" checked={notificaciones.push} onChange={handleNotif} /> Push
        </label>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Tus datos</h2>
        <button onClick={handleDescargar} disabled={descargando} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginRight: 12, cursor: 'pointer' }}>Descargar datos</button>
        <button onClick={handleEliminar} disabled={eliminando} style={{ background: '#c00', color: gold, border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}>Eliminar cuenta</button>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Cambiar contraseña</h2>
        <input type="password" value={nuevaPass} onChange={e=>setNuevaPass(e.target.value)} placeholder="Nueva contraseña" style={{ padding: 8, borderRadius: 6, border: '1px solid #FFD700', marginRight: 8 }} />
        <button onClick={handleCambiarPass} disabled={cambiandoPass || !nuevaPass} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}>Cambiar</button>
      </section>
      {mensaje && <div style={{ background: gold, color: black, borderRadius: 8, padding: 12, marginTop: 16, fontWeight: 'bold' }}>{mensaje}</div>}
    </div>
  );
}
