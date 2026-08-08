import React from 'react';

const historialDemo = [
  { fecha: '2025-08-01', goles: 3, fallados: 1, atajados: 2 },
  { fecha: '2025-08-05', goles: 2, fallados: 2, atajados: 1 },
];

export default function HistorialPenaltisPage() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', padding: '48px', color: '#FFD700', maxWidth: 700, margin: 'auto', borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Historial de Penaltis</h2>
      <table style={{ width: '100%', background: '#232323', color: '#FFD700', borderRadius: 12, boxShadow: '0 2px 8px #FFD70022', fontSize: 18, marginBottom: 32 }}>
        <thead>
          <tr style={{ background: '#FFD70022' }}>
            <th style={{ padding: 12 }}>Fecha</th>
            <th style={{ padding: 12 }}>Goles</th>
            <th style={{ padding: 12 }}>Fallados</th>
            <th style={{ padding: 12 }}>Atajados</th>
          </tr>
        </thead>
        <tbody>
          {historialDemo.map((h, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #FFD70044' }}>
              <td style={{ padding: 12 }}>{h.fecha}</td>
              <td style={{ padding: 12 }}>{h.goles}</td>
              <td style={{ padding: 12 }}>{h.fallados}</td>
              <td style={{ padding: 12 }}>{h.atajados}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Exportar historial</button>
    </div>
  );
}
