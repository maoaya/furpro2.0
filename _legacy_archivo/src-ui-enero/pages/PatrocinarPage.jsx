import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#181818';

export default function PatrocinarPage() {
  const [jugador, setJugador] = useState('');
  const [monto, setMonto] = useState('');
  const [feedback, setFeedback] = useState('');

  const handlePatrocinar = () => {
    if (!jugador || !monto) return;
    const patrocinios = JSON.parse(localStorage.getItem('patrocinios') || '[]');
    patrocinios.push({ jugador, monto, fecha: new Date().toISOString() });
    localStorage.setItem('patrocinios', JSON.stringify(patrocinios));
    setFeedback('¡Patrocinio registrado!');
    setJugador('');
    setMonto('');
    setTimeout(() => setFeedback(''), 1500);
  };

  return (
    <div style={{ background: black, color: gold, minHeight: '100vh', padding: 48, maxWidth: 600, margin: 'auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Patrocinar Jugador</h1>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, color: gold }}>
        <label>Jugador:<br />
          <input value={jugador} onChange={e => setJugador(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }} placeholder="Nombre del jugador" />
        </label>
        <label>Monto:<br />
          <input value={monto} onChange={e => setMonto(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }} placeholder="$" />
        </label>
        <button onClick={handlePatrocinar} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', marginTop: 18 }}>Patrocinar</button>
        {feedback && <div style={{ color: gold, marginTop: 16 }}>{feedback}</div>}
      </div>
    </div>
  );
}
