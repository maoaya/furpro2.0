import React, { useState } from 'react';

const usuariosDemo = [
  { id: 1, nombre: 'Juan', sigue: true },
  { id: 2, nombre: 'Pedro', sigue: false },
  { id: 3, nombre: 'Luis', sigue: true },
  { id: 4, nombre: 'Carlos', sigue: false }
];

const PartidosAmistososPage = () => {
  const [invitados, setInvitados] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [feedback, setFeedback] = useState('');

  const toggleInvitar = (id) => {
    setInvitados(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const sortearEquipos = () => {
    if (invitados.length < 2) {
      setFeedback('Selecciona al menos 2 invitados.');
      return;
    }
    const shuffled = [...invitados].sort(() => 0.5 - Math.random());
    const mitad = Math.ceil(shuffled.length / 2);
    setEquipos([
      shuffled.slice(0, mitad),
      shuffled.slice(mitad)
    ]);
    setFeedback('¡Equipos sorteados!');
    localStorage.setItem('amistosoPoints', Number(localStorage.getItem('amistosoPoints') || 0) + 5);
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setFeedback('¡URL copiada para compartir!');
  };

  return (
    <div style={{background:'#181818',color:'#FFD700',minHeight:'100vh',padding:'2rem'}}>
      <h2>Crear Partido Amistoso</h2>
      <h3>Invitar usuarios</h3>
      <ul>
        {usuariosDemo.filter(u => u.sigue).map(u => (
          <li key={u.id}>
            <label>
              <input type="checkbox" checked={invitados.includes(u.id)} onChange={() => toggleInvitar(u.id)} />
              {u.nombre}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={sortearEquipos} style={{background:'#FFD700',color:'#181818',padding:'1rem',borderRadius:'8px'}}>Sortear equipos</button>
      {equipos.length > 0 && (
        <div>
          <h4>Equipo 1: {equipos[0].join(', ')}</h4>
          <h4>Equipo 2: {equipos[1].join(', ')}</h4>
        </div>
      )}
      <button onClick={share} style={{marginLeft:'1rem',background:'#FFD700',color:'#181818',padding:'1rem',borderRadius:'8px'}}>Compartir</button>
      <div style={{marginTop:'1rem'}}>{feedback}</div>
    </div>
  );
};

export default PartidosAmistososPage;
