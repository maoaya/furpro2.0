import React, { useEffect, useState } from 'react';
import { guardarCalificacionArbitro, obtenerDatosTorneo } from '../services/CalificacionArbitroManager';

function CalificacionArbitro({ torneoId, arbitroId, onCalificar }) {
  const [datos, setDatos] = useState({ jugadores: [], equipos: [], organizador: '' });
  const [calificaciones, setCalificaciones] = useState({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function fetchDatos() {
      const res = await obtenerDatosTorneo(torneoId);
      setDatos({
        jugadores: res?.jugadores || [],
        equipos: res?.equipos || [],
        organizador: res?.organizador || '',
      });
    }
    if (torneoId) fetchDatos();
  }, [torneoId]);

  const handleChange = (tipo, id, value) => {
    setCalificaciones(c => ({ ...c, [tipo + '-' + id]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      arbitroId,
      torneoId,
      jugadorCalificaciones: datos.jugadores.map(j => ({ jugadorId: j.id, calificacion: Number(calificaciones['jugador-' + j.id] || 0) })),
      equipoCalificaciones: datos.equipos.map(eq => ({ equipoId: eq.id, calificacion: Number(calificaciones['equipo-' + eq.id] || 0) })),
      organizadorCalificacion: { organizadorId: datos.organizador, calificacion: Number(calificaciones['organizador-' + datos.organizador] || 0) },
      fecha: new Date().toISOString(),
    };
    await guardarCalificacionArbitro(payload);
    setMensaje('Calificaciones enviadas correctamente');
    if (onCalificar) onCalificar();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Calificar Jugadores</h2>
      {datos.jugadores.map(j => (
        <div key={j.id}>
          <span>{j.nombre}</span>
          <input type="number" min={1} max={10} value={calificaciones['jugador-'+j.id]||''} onChange={e=>handleChange('jugador',j.id,e.target.value)} placeholder="Calificación (1-10)" />
        </div>
      ))}
      <h2>Calificar Equipos</h2>
      {datos.equipos.map(eq => (
        <div key={eq.id}>
          <span>{eq.nombre}</span>
          <input type="number" min={1} max={10} value={calificaciones['equipo-'+eq.id]||''} onChange={e=>handleChange('equipo',eq.id,e.target.value)} placeholder="Calificación (1-10)" />
        </div>
      ))}
      <h2>Calificar Organizador</h2>
      <div>
        <span>{datos.organizador}</span>
        <input type="number" min={1} max={10} value={calificaciones['organizador-'+datos.organizador]||''} onChange={e=>handleChange('organizador',datos.organizador,e.target.value)} placeholder="Calificación (1-10)" />
      </div>
      <button type="submit">Enviar calificaciones</button>
      {mensaje && <div style={{color:'green'}}>{mensaje}</div>}
    </form>
  );
}

export default CalificacionArbitro;
