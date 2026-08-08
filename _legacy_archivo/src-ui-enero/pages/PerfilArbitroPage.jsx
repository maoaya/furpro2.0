import React from 'react';

const PerfilArbitroPage = () => {
  // Simulación de datos de árbitro desde localStorage
  const arbitro = JSON.parse(localStorage.getItem('arbitroPerfil') || '{}');
  return (
    <div style={{background:'#181818',color:'#FFD700',minHeight:'100vh',padding:'2rem'}}>
      <h2>Perfil de Árbitro</h2>
      <div style={{margin:'1.5rem 0',background:'#232323',borderRadius:12,padding:24,maxWidth:400}}>
        <p><b>Nombre:</b> {arbitro.nombre || 'No definido'}</p>
        <p><b>Experiencia:</b> {arbitro.experiencia || 'Sin experiencia registrada'}</p>
        <p><b>Partidos arbitrados:</b> {arbitro.partidos || 0}</p>
        <p><b>Certificación:</b> {arbitro.certificacion || 'No registrada'}</p>
        <p><b>Disponibilidad:</b> {arbitro.disponibilidad || 'No definida'}</p>
      </div>
      <a href="/arbitro/editar" style={{color:'#FFD700',textDecoration:'underline'}}>Editar perfil de árbitro</a>
    </div>
  );
};

export default PerfilArbitroPage;
