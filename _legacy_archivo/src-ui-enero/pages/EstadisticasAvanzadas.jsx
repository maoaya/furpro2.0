import React from 'react';
import Button from './Button';

const estadisticasDemo = [
  { id: 1, tipo: 'Goles', valor: 88 },
  { id: 2, tipo: 'Victorias', valor: 28 },
  { id: 3, tipo: 'Partidos', valor: 42 },
  { id: 4, tipo: 'Asistencias', valor: 54 },
];

export default function EstadisticasAvanzadas() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Estadísticas Avanzadas</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {estadisticasDemo.map(item => (
          <div key={item.id} style={{ background: '#232323', borderRadius: 8, padding: 24, color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', minWidth: 180, textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: 22 }}>{item.tipo}</div>
            <div style={{ fontSize: 32, margin: '12px 0' }}>{item.valor}</div>
          </div>
        ))}
      </div>
      <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginTop: 32 }}>Ver comparativas</button>
    <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginTop: 32, transition: 'background 0.3s, color 0.3s' }}>Ver comparativas</Button>
    </div>
  );
}
