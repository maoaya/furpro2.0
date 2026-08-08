import React from 'react';

export default function PagosPanel({ pagos }) {
  const pagosMock = [
    { id: 1, usuario: 'Juan', monto: 100, fecha: '2025-08-01', descripcion: 'Membresía Premium' },
    { id: 2, usuario: 'Maria', monto: 150, fecha: '2025-08-10', descripcion: 'Pago de torneo' }
  ];
  const pagosFinal = pagos && pagos.length > 0 ? pagos : pagosMock;
  return (
    <div className="pagos-panel" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, margin: '24px 0' }}>
      <h3>Pagos y Membresía Premium</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pagosFinal.map((p, idx) => (
          <li key={p.id || idx} style={{ marginBottom: 10, background: '#f7f7f7', borderRadius: 8, padding: 10 }}>
            <span>{p.descripcion}</span>
            <span style={{ float: 'right', color: '#FFD700' }}>{p.monto} €</span>
            <br /><span style={{fontSize:'0.9em',color:'#888'}}>Usuario: {p.usuario} | Fecha: {p.fecha}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


