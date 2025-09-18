import React from 'react';
import './FifaCard.css';
import FutproLogo from './FutproLogo';


const FifaCard = ({ nombre, pais, posicion, foto, goles, asistencias, partidos, onContact }) => (
  <div className="fifa-card" style={{ position: 'relative' }}>
    <div style={{ position: 'absolute', top: 10, right: 10 }}>
      <FutproLogo size={38} />
    </div>
    <img className="user-photo" src={foto} alt={`Foto de ${nombre}`} />
    <div className="user-name">{nombre}</div>
    <div className="user-country"><i className="fa-solid fa-flag"></i> {pais}</div>
    <div className="user-position">{posicion}</div>
    <div className="stats">
      <div className="stat">Goles<br />{goles}</div>
      <div className="stat">Asistencias<br />{asistencias}</div>
      <div className="stat">Partidos<br />{partidos}</div>
    </div>
    <button className="contact-btn" onClick={onContact}><i className="fa-solid fa-comment"></i> Contactar</button>
  </div>
);

export default FifaCard;
