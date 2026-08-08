import React from 'react';
import './EquipoEstadisticasPanel.css';

const EquipoEstadisticasPanel = ({ equipo }) => {
  const estadisticasMock = {
    nombre: 'Tigres',
    partidos: 30,
    victorias: 22,
    goles: 65,
    asistencias: 20,
    tarjetas: 5,
    mvp: 3,
    ranking: 1,
    logros: ['Campeón 2024', 'Fair Play']
  };
  const equipoFinal = equipo || estadisticasMock;
  return (
    <div className="equipo-estadisticas-panel">
      <h3>Estadísticas del Equipo</h3>
      <div><b>Nombre:</b> {equipoFinal.nombre}</div>
      <div><b>Partidos jugados:</b> {equipoFinal.partidos}</div>
      <div><b>Victorias:</b> {equipoFinal.victorias}</div>
      <div><b>Goles anotados:</b> {equipoFinal.goles}</div>
      <div><b>Asistencias:</b> {equipoFinal.asistencias}</div>
      <div><b>Tarjetas:</b> {equipoFinal.tarjetas}</div>
      <div><b>MVPs:</b> {equipoFinal.mvp}</div>
      <div><b>Ranking:</b> {equipoFinal.ranking}</div>
      <div><b>Logros:</b> {equipoFinal.logros.join(', ')}</div>
    </div>
  );
};

export default EquipoEstadisticasPanel;
