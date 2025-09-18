import React from 'react';
import ComparativasPanel from '../components/ComparativasPanel';
import '../components/ComparativasPanel.css';

const jugadoresDemo = [
  { nombre: 'Juan Pérez', partidos: 30, goles: 24, asistencias: 12, victorias: 18, mvp: 5, tarjetas: 3, faltas: 7, puntos: 240 },
  { nombre: 'Ana Gómez', partidos: 28, goles: 2, asistencias: 8, victorias: 14, mvp: 2, tarjetas: 1, faltas: 3, puntos: 80 },
  { nombre: 'Carlos Ruiz', partidos: 32, goles: 5, asistencias: 10, victorias: 20, mvp: 3, tarjetas: 2, faltas: 5, puntos: 120 },
];
const equiposDemo = [
  { nombre: 'Atlético Nacional', partidos: 42, victorias: 28, goles: 88, ranking: 2, asistencias: 40, tarjetas: 8, faltas: 22 },
  { nombre: 'River Plate', partidos: 40, victorias: 25, goles: 80, ranking: 3, asistencias: 35, tarjetas: 6, faltas: 18 },
  { nombre: 'Barcelona', partidos: 45, victorias: 32, goles: 95, ranking: 1, asistencias: 50, tarjetas: 5, faltas: 15 },
];
const usuarioDemo = {
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
  { nombre: 'Imbatible', descripcion: 'No falló ningún penalti en una ronda.' }
];

function ComparativasPage() {
  return (
    <div style={{background:'#181818',minHeight:'100vh',padding:'48px',color:'#FFD700'}}>
      <h2>Comparativas de Jugadores y Equipos</h2>
      <ComparativasPanel jugadores={jugadoresDemo} equipos={equiposDemo} usuario={usuarioDemo} logros={logrosDemo} />
      <div style={{marginTop:24}}>
        <a href="/estadisticas-avanzadas" style={{background:'#FFD700',color:'#232323',border:'none',borderRadius:'8px',padding:'12px 32px',fontWeight:'bold',fontSize:'1.1em',cursor:'pointer',marginRight:16,textDecoration:'none'}}>Ver estadísticas avanzadas</a>
        <a href="/editar-estadisticas" style={{background:'#FFD700',color:'#232323',border:'none',borderRadius:'8px',padding:'12px 32px',fontWeight:'bold',fontSize:'1.1em',cursor:'pointer',textDecoration:'none'}}>Editar Estadísticas</a>
      </div>
    </div>
  );
}

export default ComparativasPage;
