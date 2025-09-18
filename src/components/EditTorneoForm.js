import React, { useState } from 'react';
import useArbitrosSocket from '../hooks/useArbitrosSocket';
import io from 'socket.io-client';
const socket = io('https://futpro.vip'); // Ajusta la URL según tu backend

export default function EditTorneoForm({ torneo, onSave }) {
  const [form, setForm] = useState({ ...torneo });
  const [arbitros, setArbitros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useArbitrosSocket(setArbitros);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Llamada real al backend para editar el torneo
      const res = await fetch(`/api/torneos/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al editar torneo');
      // Emitir evento por sockets para actualización en tiempo real
      socket.emit('solicitarArbitros');
      if (onSave) onSave(form);
    } catch (err) {
      setError('Error al editar torneo');
    }
    setLoading(false);
  };

  // Validación avanzada: solo árbitros activos y con calificación > 3
  const arbitrosValidos = arbitros.filter(a => a.estado === 'activo' && (a.calificacionPromedio || 0) > 3);
  const arbitroSeleccionado = arbitros.find(a => a.id === form.arbitroId);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Torneo</h2>
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del torneo" required />
      <input name="fecha" value={form.fecha} onChange={handleChange} placeholder="Fecha" />
      <input name="equipos" value={form.equipos} onChange={handleChange} placeholder="Equipos (separados por coma)" />
      <select name="arbitroId" value={form.arbitroId} onChange={handleChange} required>
        <option value="">Selecciona un árbitro</option>
        {arbitrosValidos.map(a => (
          <option key={a.id} value={a.id}>{a.nombre}</option>
        ))}
      </select>
      {arbitroSeleccionado && (
        <div style={{margin:'16px 0',padding:8,border:'1px solid #ccc',borderRadius:8,background:'#f9f9f9'}}>
          <img src={arbitroSeleccionado.fotoUrl} alt={arbitroSeleccionado.nombre} style={{width:60,height:60,borderRadius:'50%',objectFit:'cover',marginRight:8}} />
          <div><strong>{arbitroSeleccionado.nombre}</strong></div>
          <div>Experiencia: {arbitroSeleccionado.experiencia}</div>
          <div>Certificaciones: {arbitroSeleccionado.certificaciones?.join(', ')}</div>
          <div>Estado: {arbitroSeleccionado.estado}</div>
          <div>Calificación: {arbitroSeleccionado.calificacionPromedio || 'N/A'}</div>
        </div>
      )}
  <button type="submit" disabled={loading || !form.arbitroId || !arbitrosValidos.find(a => a.id === form.arbitroId)}>Guardar cambios</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
