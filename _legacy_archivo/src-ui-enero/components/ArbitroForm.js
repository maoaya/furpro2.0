import React, { useState } from 'react';
import { crearArbitro } from '../services/ArbitroManager';

const initialState = {
  nombre: '',
  fotoUrl: '',
  experiencia: '',
  certificaciones: '',
  contacto: '',
  historialPartidos: '',
  estado: 'activo',
};

export default function ArbitroForm({ onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await crearArbitro({
        ...form,
        certificaciones: form.certificaciones.split(','),
        historialPartidos: form.historialPartidos.split(','),
      });
      setForm(initialState);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Error al crear árbitro');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Árbitro</h2>
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input name="fotoUrl" value={form.fotoUrl} onChange={handleChange} placeholder="URL Foto" />
      <input name="experiencia" value={form.experiencia} onChange={handleChange} placeholder="Experiencia" />
      <input name="certificaciones" value={form.certificaciones} onChange={handleChange} placeholder="Certificaciones (separadas por coma)" />
      <input name="contacto" value={form.contacto} onChange={handleChange} placeholder="Contacto" />
      <input name="historialPartidos" value={form.historialPartidos} onChange={handleChange} placeholder="Historial de partidos (separados por coma)" />
      <select name="estado" value={form.estado} onChange={handleChange}>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
      <button type="submit" disabled={loading}>Registrar</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
