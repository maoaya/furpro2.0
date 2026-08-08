import React from 'react';
import FifaProfilePanel from '../components/FifaProfilePanel.jsx';
import '../components/FifaProfilePanel.css';
import LogrosPanel from '../components/LogrosPanel';
import '../components/LogrosPanel.css';

const jugadorDemo = {
  nombre: 'Juan Pérez',
  pais: 'Colombia',
  posicion: 'Delantero',
  foto: 'https://randomuser.me/api/portraits/men/32.jpg',
  goles: 24,
  asistencias: 12,
  partidos: 30,
  victorias: 18,
  tarjetas: 3,
  faltas: 7,
  mvp: 5,
  puntos: 240,
  club: 'Atlético Nacional',
  categoria: 'Sub-23',
  nivel: 'Profesional',
  edad: 22
};
const logrosDemo = [
  { nombre: 'Goleador', descripcion: 'Anotó 5 goles en penaltis.' },
  { nombre: 'MVP', descripcion: 'Jugador más valioso en 5 partidos.' }
];

function JugadorDetallePage() {
  return (
    <div style={{background:'#181818',minHeight:'100vh',padding:'48px',color:'#FFD700'}}>
      <h2>Detalle de Jugador</h2>
      <FifaProfilePanel usuario={jugadorDemo} />
      <div style={{marginTop:32}}>
        <LogrosPanel logros={logrosDemo} />
      </div>
    </div>
  );
}

export default JugadorDetallePage;
