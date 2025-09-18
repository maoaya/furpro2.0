import React, { useEffect, useState } from 'react';
import { listarArbitros } from '../services/ArbitroManager';
import useArbitrosSocket from '../hooks/useArbitrosSocket';

const initialState = {
  nombre: '',
  fecha: '',
  equipos: '',
  arbitroId: '',
};

export default function TorneoForm({ onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [arbitros, setArbitros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar árbitros al montar el componente
  useEffect(() => {
    listarArbitros()
      .then(setArbitros)
      .catch(() => setError('Error al cargar árbitros'));
  }, []);

  // Actualización instantánea de árbitros usando sockets
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
      // Aquí iría la lógica para crear el torneo
      setForm(initialState);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Error al crear torneo');
    }
    setLoading(false);
  };

  // Buscar árbitro seleccionado
  const arbitroSeleccionado = arbitros.find(a => a.id === form.arbitroId);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Torneo</h2>
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del torneo" required />
      <input name="fecha" value={form.fecha} onChange={handleChange} placeholder="Fecha" />
      <input name="equipos" value={form.equipos} onChange={handleChange} placeholder="Equipos (separados por coma)" />
      <select name="arbitroId" value={form.arbitroId} onChange={handleChange} required>
        <option value="">Selecciona un árbitro</option>
        {arbitros.map(a => (
          <option key={a.id} value={a.id}>{a.nombre}</option>
        ))}
      </select>
      {/* Visualización de datos del árbitro seleccionado */}
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
      <button type="submit" disabled={loading}>Crear</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
