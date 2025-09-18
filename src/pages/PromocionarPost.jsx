import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';

const breadcrumbs = [
  { label: 'Inicio', path: '/' },
  { label: 'Ranking', path: '/ranking' },
  { label: 'Equipos', path: '/equipos' },
  { label: 'Torneos', path: '/torneos' },
  { label: 'Perfil', path: '/perfil' },
  { label: 'Programación', path: '/programacion' },
  // ...agrega más rutas si es necesario
];

function BreadcrumbsNav() {
  return (
    <nav className="breadcrumbs-nav" style={{ margin: '16px 0', fontSize: '1rem' }}>
      {breadcrumbs.map((crumb, idx) => (
        <span key={crumb.path}>
          <Link to={crumb.path} style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold' }}>{crumb.label}</Link>
          {idx < breadcrumbs.length - 1 && <span style={{ color: '#222', margin: '0 8px' }}>/</span>}
        </span>
      ))}
    </nav>
  );
}

export default function PromocionarPost({ publicacion }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', correo: '' });
  const [linkPago, setLinkPago] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');
    try {
      // Llama a tu backend para crear el link de pago Wompi
      const res = await axios.post('/api/wompi/link', {
        monto: publicacion.precio || 10000,
        descripcion: publicacion.titulo,
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        correo: form.correo
      });
      setLinkPago(res.data.link);
      // Guarda el registro de la promoción en Supabase
      await supabase.from('promociones').insert({
        publicacion_id: publicacion.id,
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        correo: form.correo,
        link_pago: res.data.link,
        estado: 'pendiente'
      });
    } catch (err) {
      setFeedback('Error al generar link de pago o registrar promoción');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '60vh', padding: 32 }}>
      <BreadcrumbsNav />
      <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Promocionar publicación</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" style={{ borderRadius: 8, padding: 8 }} required />
        <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" style={{ borderRadius: 8, padding: 8 }} required />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" style={{ borderRadius: 8, padding: 8 }} required />
        <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" style={{ borderRadius: 8, padding: 8 }} required />
        <button type="submit" style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }} disabled={loading}>
          {loading ? 'Procesando...' : 'Promocionar'}
        </button>
      </form>
      {linkPago && (
        <div style={{ marginTop: 24 }}>
          <strong>Link de pago generado:</strong><br />
          <a href={linkPago} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'underline' }}>{linkPago}</a>
        </div>
      )}
      {feedback && <div style={{ color: 'red', marginTop: 12 }}>{feedback}</div>}
    </div>
  );
}
