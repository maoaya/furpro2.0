import React from 'react';
import './LogrosPanel.css';

const LogrosPanel = ({ logros }) => (
  <div className="logros-panel">
    <h3>Panel de Logros</h3>
    <ul>
      {logros.map(l => (
        <li key={l.id}>
          <strong>{l.nombre}</strong>: {l.descripcion}
        </li>
      ))}
    </ul>
  </div>
);

export default LogrosPanel;
