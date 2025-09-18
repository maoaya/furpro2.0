import React from 'react';

const historialDemo = [
  { id: 1, tipo: 'Partido', detalle: 'Ganado vs River Plate', fecha: '2025-08-10' },
  { id: 2, tipo: 'Logro', detalle: 'Campeón Torneo FutPro', fecha: '2025-07-28' },
  { id: 3, tipo: 'Actividad', detalle: 'Registrado en la app', fecha: '2025-06-01' },
];

export default function Historial() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Historial</h2>
      {historialDemo.map(item => (
        <div key={item.id} style={{ background: '#232323', borderRadius: 8, padding: 24, color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', marginBottom: 24 }}>
          <div style={{ fontWeight: 'bold', fontSize: 20 }}>{item.tipo}</div>
          <div style={{ fontSize: 18, margin: '12px 0' }}>{item.detalle}</div>
          <div style={{ fontSize: 15, color: '#FFD70099' }}>{item.fecha}</div>
        </div>
      ))}
    </div>
  );
}
