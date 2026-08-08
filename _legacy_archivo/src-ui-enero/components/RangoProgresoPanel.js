import React from 'react';
import './RangoProgresoPanel.css';

const rangos = [
  { nombre: 'Básico', min: 0, max: 4 },
  { nombre: 'Amateur', min: 5, max: 9 },
  { nombre: 'Bronce', min: 10, max: 19 },
  { nombre: 'Plata', min: 20, max: 29 },
  { nombre: 'Oro', min: 30, max: 39 },
  { nombre: 'Gold', min: 40, max: 59 },
  { nombre: 'Diamante', min: 60, max: 89 },
  { nombre: 'Leyenda', min: 90, max: 119 },
  { nombre: 'Super Pro', min: 120, max: 999 }
];

function calcularRango(partidos) {
  return rangos.find(r => partidos >= r.min && partidos <= r.max) || rangos[rangos.length-1];
}

function calcularProgreso(partidos) {
  const rango = calcularRango(partidos);
  const progreso = ((partidos - rango.min) / (rango.max - rango.min)) * 100;
  return Math.max(0, Math.min(100, progreso));
}

import { useNavigate } from 'react-router-dom';

const RangoProgresoPanel = ({ usuario, ritmoPartidos = 2 }) => {
  const usuarioMock = {
    partidos: 40,
    goles: 30,
    asistencias: 12,
    victorias: 25,
    tarjetas: 2,
    faltas: 5,
    mvp: 3
  };
  const user = usuario || usuarioMock;
  const rangoActual = calcularRango(user.partidos);
  const progreso = calcularProgreso(user.partidos);
  const partidosRestantes = rangoActual.max - user.partidos;
  const tiempoEstimado = partidosRestantes > 0 ? Math.ceil(partidosRestantes / ritmoPartidos) : 0;
  const navigate = useNavigate();

  return (
    <div className="rango-progreso-panel">
      <h3>Progreso de Rango</h3>
      <div className="barra-progreso">
        <div className="progreso" style={{width: `${progreso}%`}}></div>
        <span className="progreso-label">{progreso.toFixed(1)}%</span>
      </div>
      <div className="rango-info">
        <b>Rango actual:</b> <span className="rango-chip">{rangoActual.nombre}</span><br />
        <b>Partidos jugados:</b> {user.partidos}<br />
        <b>Goles:</b> {user.goles} | <b>Asistencias:</b> {user.asistencias} | <b>Victorias:</b> {user.victorias}<br />
        <b>Tarjetas:</b> {user.tarjetas || 0} | <b>Faltas:</b> {user.faltas || 0} | <b>MVP:</b> {user.mvp || 0}<br />
        <b>Partidos para subir:</b> {partidosRestantes > 0 ? partidosRestantes : 0}
      </div>
      <div className="panel-tiempo">
        <b>Tiempo estimado para subir de rango:</b> {tiempoEstimado > 0 ? `${tiempoEstimado} semanas (jugando ${ritmoPartidos} partidos/semana)` : '¡Ya alcanzaste el máximo rango!'}
      </div>
      <div style={{marginTop:'24px',display:'flex',gap:'16px',justifyContent:'center'}}>
        <button className="nav-btn" onClick={()=>navigate('/perfil')}>Ir a Perfil</button>
        <button className="nav-btn" onClick={()=>navigate('/equipos')}>Ir a Equipos</button>
      </div>
    </div>
  );
};

export default RangoProgresoPanel;
