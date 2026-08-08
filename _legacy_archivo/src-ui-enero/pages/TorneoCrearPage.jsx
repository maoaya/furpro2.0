import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#181818';

export default function TorneoCrearPage() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleCrear = () => {
    if (!nombre || !fecha || !ubicacion) return;
    const torneos = JSON.parse(localStorage.getItem('torneos') || '[]');
    torneos.push({ nombre, fecha, ubicacion, id: Date.now() });
    localStorage.setItem('torneos', JSON.stringify(torneos));
    setFeedback('¡Torneo creado!');
    setNombre('');
    setFecha('');
    setUbicacion('');
    setTimeout(() => setFeedback(''), 1500);
  };

  return (
    <div style={{ background: black, color: gold, minHeight: '100vh', padding: 48, maxWidth: 600, margin: 'auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Crear Torneo</h1>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, color: gold }}>
        <label>Nombre:<br />
          <input value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }} />
        </label>
        <label>Fecha:<br />
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }} />
        </label>
        <label>Ubicación:<br />
          <input value={ubicacion} onChange={e => setUbicacion(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }} />
        </label>
        <button onClick={handleCrear} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', marginTop: 18 }}>Crear Torneo</button>
        {feedback && <div style={{ color: gold, marginTop: 16 }}>{feedback}</div>}
      </div>
    </div>
  );
}
