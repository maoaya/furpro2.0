import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const gold = '#FFD700';

export default function RegistroNuevoClean() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', nombre: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.email || !formData.password || !formData.confirmPassword) { setError('Completa email y contraseñas'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    try {
      setLoading(true);
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { nombre: formData.nombre || '' } }
      });
      if (signUpError) throw signUpError;
      setSuccess('Cuenta creada. Revisa tu correo para confirmar.');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) { setError(err.message || 'Error en registro'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#121212', border: `2px solid ${gold}`, borderRadius: 16, padding: 20 }}>
        <h2 style={{ color: gold, marginTop: 0, textAlign: 'center' }}>Registro Nuevo</h2>
        {error && <div style={{ background: '#3b0d0d', color: '#ff9b9b', border: '1px solid #ff4d4f', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{error}</div>}
        {success && <div style={{ background: '#0e3323', color: '#9ff2c3', border: '1px solid #27d17c', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{success}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
          <input name="nombre" placeholder="Nombre (opcional)" value={formData.nombre} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }} />
          <input name="email" type="email" required placeholder="Correo" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }} />
          <input name="password" type="password" required placeholder="Contraseña" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }} />
          <input name="confirmPassword" type="password" required placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#111', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Registrando...' : 'Crear cuenta'}</button>
        </form>
      </div>
    </div>
  );
}
