import React, { useEffect, useState } from 'react';

const recomendaciones = [
  'Juega más penaltis para mejorar tu puntería.',
  'Participa en partidos amistosos para sumar experiencia.',
  'Comparte tus logros para motivar a otros.',
  'Invita amigos y suma puntos extra.'
];

const PuntosUsuarioPage = () => {
  const [puntos, setPuntos] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const penalty = Number(localStorage.getItem('penaltyPoints') || 0);
    const amistosos = Number(localStorage.getItem('amistosoPoints') || 0);
    setPuntos(penalty + amistosos);
  }, []);

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setFeedback('¡URL copiada para compartir!');
  };

  return (
    <div style={{background:'#181818',color:'#FFD700',minHeight:'100vh',padding:'2rem'}}>
      <h2>Mis Puntos</h2>
      <p>Total: {puntos}</p>
      <h3>Recomendaciones de mejora</h3>
      <ul>
        {recomendaciones.map((rec, i) => <li key={i}>{rec}</li>)}
      </ul>
      <button onClick={share} style={{background:'#FFD700',color:'#181818',padding:'1rem',borderRadius:'8px'}}>Compartir</button>
      <div style={{marginTop:'1rem'}}>{feedback}</div>
    </div>
  );
};

export default PuntosUsuarioPage;
