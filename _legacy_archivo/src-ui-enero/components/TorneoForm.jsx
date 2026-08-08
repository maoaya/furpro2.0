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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="torneo-form">
      {/* ...resto del formulario... */}
    </form>
  );
}
