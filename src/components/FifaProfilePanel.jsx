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
        {/* ...resto del componente... */}
      </div>
    </div>
  );
};

export default FifaProfilePanel;
