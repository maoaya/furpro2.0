import React from 'react';

const transmisionesMock = [
  { id: 1, titulo: 'Final Torneo Clausura', url: 'https://www.youtube.com/watch?v=final2025' },
  { id: 2, titulo: 'Partido Tigres vs Leones', url: 'https://www.youtube.com/watch?v=partido1' }
];

export default function TransmisionesPanel({ transmisiones = transmisionesMock }) {
  return (
    <div className="transmisiones-panel">
      <h3>Transmisiones en Vivo</h3>
      <ul>
        {transmisiones.map(t => (
          <li key={t.id}>
            <strong>{t.titulo}</strong> - <a href={t.url} target="_blank" rel="noopener noreferrer">Ver transmisión</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
