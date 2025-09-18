// ...existing code...
import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#222';

export default function IntegrationsPage() {
  const [integraciones, setIntegraciones] = useState([
    { id: 1, nombre: 'Google', estado: 'Activo' },
    { id: 2, nombre: 'Facebook', estado: 'Pendiente' },
  ]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Integraciones</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Agregar integración</button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Integraciones</h1>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: black, color: gold }}>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Nombre</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {integraciones.map(i => (
                <tr key={i.id} style={{ background: i.id % 2 === 0 ? '#333' : black }}>
                  <td style={{ padding: 10 }}>{i.nombre}</td>
                  <td style={{ padding: 10 }}>{i.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Ver reportes</button>
      </aside>
    </div>
  );
}
// ...existing code...
