import React from 'react';

export default function ModeracionPanel({ reportes }) {
  const reportesMock = [
    { id: 1, motivo: 'Spam', usuario: 'Pedro', fecha: '2025-08-20' },
    { id: 2, motivo: 'Lenguaje ofensivo', usuario: 'Lucas', fecha: '2025-08-21' }
  ];
  const reportesFinal = reportes && reportes.length > 0 ? reportes : reportesMock;
  return (
    <div className="moderacion-panel" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, margin: '24px 0' }}>
      <h3>Moderación y Reportes</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reportesFinal.map((r, idx) => (
          <li key={r.id || idx} style={{ marginBottom: 10, background: '#ffeaea', borderRadius: 8, padding: 10 }}>
            <span>{r.motivo}</span>
            <span style={{ float: 'right', color: '#d32f2f' }}>{r.fecha}</span>
            <br /><span style={{fontSize:'0.9em',color:'#888'}}>Usuario: {r.usuario}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


