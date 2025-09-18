import React, { useState } from 'react';
import { Button } from '../components/Button';

const gold = '#FFD700';
const black = '#222';

export default function ComparativasPage() {
  const [comparativas, setComparativas] = useState([
    { id: 1, equipoA: 'Real Madrid', equipoB: 'Barcelona', resultado: '2-1' },
    { id: 2, equipoA: 'Chelsea', equipoB: 'Arsenal', resultado: '1-1' },
    { id: 3, equipoA: 'Boca', equipoB: 'River', resultado: '0-3' }
  ]);
  const [msg, setMsg] = useState('');

  function handleNuevaComparativa() {
    setMsg('Función para crear nueva comparativa...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleFiltrar() {
    setMsg('Filtrando comparativas...');
    setTimeout(() => setMsg(''), 2000);
  }
  return (
    <div style={{ background: black, minHeight: '100vh', color: gold, padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Comparativas</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <Button onClick={handleNuevaComparativa} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Nueva comparativa</Button>
        <Button onClick={handleFiltrar} style={{ background: '#232323', color: gold, border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Filtrar</Button>
      </div>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32 }}>
        <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Historial de comparativas</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: black, color: gold }}>
              <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Equipo A</th>
              <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Equipo B</th>
              <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {comparativas.map(c => (
              <tr key={c.id} style={{ background: c.id % 2 === 0 ? '#333' : black }}>
                <td style={{ padding: 10 }}>{c.equipoA}</td>
                <td style={{ padding: 10 }}>{c.equipoB}</td>
                <td style={{ padding: 10 }}>{c.resultado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {msg && <div style={{ marginTop: 24, background: '#232323', color: gold, padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>{msg}</div>}
    </div>
  );
}
