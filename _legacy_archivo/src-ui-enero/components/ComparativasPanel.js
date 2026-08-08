import React from 'react';
import './ComparativasPanel.css';

import RangoProgresoPanel from './RangoProgresoPanel';
import LogrosPanel from './LogrosPanel';

const ComparativasPanel = ({ jugadores, equipos, usuario, logros }) => {
  const comparativasMock = [
    { equipoA: 'Tigres', equipoB: 'Leones', partidos: 5, victoriasA: 3, victoriasB: 2 },
    { equipoA: 'Águilas', equipoB: 'Tigres', partidos: 4, victoriasA: 1, victoriasB: 3 }
  ];

  const comparativas = equipos || comparativasMock;

  return (
    <div className="comparativas-panel">
      <h3>Comparativa de Jugadores</h3>
      <table className="comparativas-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Partidos</th>
            <th>Goles</th>
            <th>Asistencias</th>
            <th>Victorias</th>
            <th>MVP</th>
            <th>Tarjetas</th>
            <th>Faltas</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.map((j, idx) => (
            <tr key={idx}>
              <td>{j.nombre}</td>
              <td>{j.partidos}</td>
              <td>{j.goles}</td>
              <td>{j.asistencias}</td>
              <td>{j.victorias}</td>
              <td>{j.mvp}</td>
              <td>{j.tarjetas || 0}</td>
              <td>{j.faltas || 0}</td>
              <td>{j.puntos || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{marginTop:'32px'}}>Comparativa de Equipos</h3>
      <table className="comparativas-table">
        <thead>
          <tr>
            <th>Equipo A</th>
            <th>Equipo B</th>
            <th>Partidos</th>
            <th>Victorias A</th>
            <th>Victorias B</th>
          </tr>
        </thead>
        <tbody>
          {comparativas.map((c, idx) => (
            <tr key={idx}>
              <td>{c.equipoA}</td>
              <td>{c.equipoB}</td>
              <td>{c.partidos}</td>
              <td>{c.victoriasA}</td>
              <td>{c.victoriasB}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:'32px'}}>
        <RangoProgresoPanel usuario={usuario} ritmoPartidos={2} />
        <LogrosPanel logros={logros} />
      </div>
    </div>
  );
};

export default ComparativasPanel;
