import React, { useState } from 'react';
import './FifaCard.css';

const rangos = [
  'Básico', 'Amateur', 'Bronce', 'Plata', 'Oro', 'Gold', 'Diamante', 'Leyenda', 'Super Pro'
];

function calcularRango(partidos) {
  if (partidos < 5) return rangos[0];
  if (partidos < 10) return rangos[1];
  if (partidos < 20) return rangos[2];
  if (partidos < 30) return rangos[3];
  if (partidos < 40) return rangos[4];
  if (partidos < 60) return rangos[5];
  if (partidos < 90) return rangos[6];
  if (partidos < 120) return rangos[7];
  return rangos[8];
}

const FifaProfilePanel = ({ usuario, onClose }) => {
  const [showRangoInfo, setShowRangoInfo] = useState(false);
  const usuarioMock = {
    nombre: 'Juan Pérez',
    foto: 'https://randomuser.me/api/portraits/men/1.jpg',
    pais: 'Argentina',
    posicion: 'Delantero',
    club: 'Tigres',
    categoria: 'Libre',
    nivel: 'Aficionado',
    edad: 25,
    partidos: 40,
    goles: 20,
    asistencias: 8
  };
  const user = usuario || usuarioMock;
  const rango = calcularRango(user.partidos);
  return (
    <div className="fifa-profile-panel">
      <div className="fifa-profile-overlay" onClick={onClose}></div>
      <div className="fifa-profile-content">
        <button className="close-btn" onClick={onClose} title="Cerrar">&times;</button>
        <div style={{marginBottom:'24px'}}>
          <img className="user-photo" src={user.foto} alt={`Foto de ${user.nombre}`} />
          <div className="user-name">{user.nombre}</div>
          <div className="user-country"><i className="fa-solid fa-flag"></i> {user.pais}</div>
          <div className="user-position">{user.posicion}</div>
          <div className="user-categorias" style={{margin:'12px 0'}}>
            <span className="categoria-chip"><i className="fa-solid fa-users"></i> {user.club || 'Sin club'}</span>
            <span className="categoria-chip"><i className="fa-solid fa-layer-group"></i> {user.categoria || 'Libre'}</span>
            <span className="categoria-chip"><i className="fa-solid fa-star"></i> {user.nivel || 'Aficionado'}</span>
            <span className="categoria-chip"><i className="fa-solid fa-cake-candles"></i> {user.edad ? user.edad + ' años' : 'Edad no definida'}</span>
            <span className="categoria-chip" style={{background:'#FFD700',color:'#232323',fontWeight:'bold'}}><i className="fa-solid fa-medal"></i> {rango}</span>
          </div>
        </div>
        <div className="stats">
          <div className="stat">Goles<br />{user.goles}</div>
          <div className="stat">Asistencias<br />{user.asistencias}</div>
          <div className="stat">Partidos<br />{user.partidos}</div>
        </div>
        <button className="contact-btn" onClick={()=>alert(`Contacto con ${user.nombre}`)}><i className="fa-solid fa-comment"></i> Contactar</button>
        <button className="rango-btn" onClick={()=>setShowRangoInfo(s=>!s)} style={{marginTop:12}}><i className="fa-solid fa-arrow-up"></i> ¿Cómo subir de rango?</button>
        {showRangoInfo && (
          <div className="rango-info" style={{background:'#232323',color:'#FFD700',borderRadius:'12px',padding:'16px',marginTop:'12px',fontSize:'1em'}}>
            <b>Rangos:</b> Básico, Amateur, Bronce, Plata, Oro, Gold, Diamante, Leyenda, Super Pro.<br />
            <b>Algoritmo:</b> El rango sube según la cantidad de partidos jugados.<br />
            <ul style={{textAlign:'left',margin:'12px 0 0 24px'}}>
              <li>Básico: &lt;5 partidos</li>
              <li>Amateur: 5-9 partidos</li>
              <li>Bronce: 10-19 partidos</li>
              <li>Plata: 20-29 partidos</li>
              <li>Oro: 30-39 partidos</li>
              <li>Gold: 40-59 partidos</li>
              <li>Diamante: 60-89 partidos</li>
              <li>Leyenda: 90-119 partidos</li>
              <li>Super Pro: 120+ partidos</li>
            </ul>
            <span>¡Juega más partidos para subir de rango!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FifaProfilePanel;
