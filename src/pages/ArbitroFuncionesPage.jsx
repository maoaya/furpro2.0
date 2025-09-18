import React, { useEffect, useState } from 'react';

const ArbitroFuncionesPage = () => {
  const [designaciones, setDesignaciones] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Simulación: cargar designaciones y partidos arbitrados desde localStorage
    setDesignaciones(JSON.parse(localStorage.getItem('arbitroDesignaciones') || '[]'));
    setHistorial(JSON.parse(localStorage.getItem('arbitroHistorial') || '[]'));
  }, []);

  const aceptarDesignacion = (id) => {
    const partido = designaciones.find(d => d.id === id);
    setHistorial(prev => {
      const nuevo = [...prev, partido];
      localStorage.setItem('arbitroHistorial', JSON.stringify(nuevo));
      return nuevo;
    });
    setDesignaciones(prev => {
      const nuevo = prev.filter(d => d.id !== id);
      localStorage.setItem('arbitroDesignaciones', JSON.stringify(nuevo));
      return nuevo;
    });
    setFeedback('¡Designación aceptada! Se agregó a tu historial.');
  };

  return (
    <div style={{background:'#181818',color:'#FFD700',minHeight:'100vh',padding:'2rem'}}>
      <h2>Funciones de Árbitro</h2>
      <h3>Designaciones pendientes</h3>
      {designaciones.length === 0 ? <p>No tienes designaciones pendientes.</p> : (
        <ul>
          {designaciones.map(d => (
            <li key={d.id} style={{marginBottom:12}}>
              Partido: {d.partido} | Fecha: {d.fecha}
              <button onClick={() => aceptarDesignacion(d.id)} style={{marginLeft:12,background:'#FFD700',color:'#181818',borderRadius:6,padding:'4px 12px'}}>Aceptar</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Historial de partidos arbitrados</h3>
      {historial.length === 0 ? <p>No has arbitrado partidos aún.</p> : (
        <ul>
          {historial.map((h,i) => (
            <li key={i}>Partido: {h.partido} | Fecha: {h.fecha}</li>
          ))}
        </ul>
      )}
      <div style={{marginTop:'1.5rem',fontWeight:'bold'}}>{feedback}</div>
    </div>
  );
};

export default ArbitroFuncionesPage;
