import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import FutproLogo from '../components/FutproLogo.jsx';

export default function RegistroPage({ onRegisterSuccess }) {
  const { registerWithEmail } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', nombre: '' });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const res = await registerWithEmail(form.email, form.password, form.nombre);
      if (res && res.user) {
        setMsg('¡Registro exitoso! Revisa tu correo para activar la cuenta.');
        onRegisterSuccess && onRegisterSuccess(res.user);
      } else {
        setError(res?.error?.message || 'Error al registrar');
      }
    } catch (e) {
      setError(e.message || 'Error al registrar');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '400px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <FutproLogo size={64} />
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Crear cuenta FutPro</h2>
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo" required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', marginBottom: 16 }} />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', marginBottom: 16 }} />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña" required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', marginBottom: 16 }} />
      <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', width: '100%' }}>Registrarme</button>
      {msg && <div style={{ marginTop: 16, color: '#52c41a', fontWeight: 'bold' }}>{msg}</div>}
      {error && <div style={{ marginTop: 16, color: '#FF4D4F', fontWeight: 'bold' }}>{error}</div>}
    </form>
  );
}
