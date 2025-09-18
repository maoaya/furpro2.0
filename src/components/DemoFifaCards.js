import React from 'react';
import FifaCard from './FifaCard';
import './FifaCard.css';
// Ensure that FifaCard.js and FifaCard.css exist in the same directory and FifaCard exports a valid React component.

// If you have another declaration of DemoFifaCards in this file or imported elsewhere, remove or rename it.
// The following code is correct as long as DemoFifaCards is only declared once in this file.
const DemoFifaCards = () => (
  <div style={{display:'flex',flexWrap:'wrap',gap:'32px',justifyContent:'center',background:'#181818',minHeight:'100vh',padding:'40px'}}>
    <FifaCard
      nombre="Juan Pérez"
      pais="Colombia"
      posicion="Delantero"
      foto="https://randomuser.me/api/portraits/men/32.jpg"
      goles={24}
      asistencias={12}
      partidos={30}
      onContact={() => alert('Contacto con Juan Pérez')}
    />
    <FifaCard
      nombre="Ana Gómez"
      pais="Argentina"
      posicion="Portera"
      foto="https://randomuser.me/api/portraits/women/44.jpg"
      goles={2}
      asistencias={8}
      partidos={28}
      onContact={() => alert('Contacto con Ana Gómez')}
    />
    <FifaCard
      nombre="Carlos Ruiz"
      pais="México"
      posicion="Defensa"
      foto="https://randomuser.me/api/portraits/men/65.jpg"
      goles={5}
      asistencias={10}
      partidos={32}
      onContact={() => alert('Contacto con Carlos Ruiz')}
    />
  </div>
);

// Make sure there is only one declaration of DemoFifaCards in this file.
// Remove any previous or duplicate declarations above this code.

export default DemoFifaCards;
