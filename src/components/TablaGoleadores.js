import React, { useState } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

export default function TablaGoleadores({ partidos, onAddGoleador }) {
  const [goleadores, setGoleadores] = useState({}); // { partidoId: [goleadores] }

  const handleAddGoleador = (partidoId, nombre) => {
    const nuevos = { ...goleadores };
    if (!nuevos[partidoId]) nuevos[partidoId] = [];
    nuevos[partidoId].push(nombre);
    setGoleadores(nuevos);
    socket.emit('goleadoresActualizados', nuevos);
    if (onAddGoleador) onAddGoleador();
  };

  return (
    <div style={{margin:'24px 0'}}>
      <h3>Tabla de Goleadores</h3>
      {partidos.map((p, idx) => (
        <div key={p.id || idx} style={{marginBottom:16,padding:8,border:'1px solid #ccc',borderRadius:8}}>
          <strong>{p.nombre || `Partido ${idx+1}`}</strong> - {p.fecha} {p.hora}
          <ul>
            {(goleadores[p.id] || []).map((g, i) => <li key={i}>{g}</li>)}
          </ul>
          <input type="text" placeholder="Nombre goleador" id={`goleador-${p.id}`} />
          <button onClick={() => {
            const input = document.getElementById(`goleador-${p.id}`);
            if (input && input.value) {
              handleAddGoleador(p.id, input.value);
              input.value = '';
            }
          }}>Agregar Goleador</button>
        </div>
      ))}
    </div>
  );
}
