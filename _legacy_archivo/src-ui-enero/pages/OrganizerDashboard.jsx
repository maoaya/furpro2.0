import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#222';

export default function OrganizerDashboard() {
  const [torneos, setTorneos] = useState([
    { id: 1, nombre: 'Torneo Apertura', equipos: 12 },
    { id: 2, nombre: 'Torneo Clausura', equipos: 10 },
  ]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Organizador</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Crear torneo</button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Panel de Organización</h1>
          <ul>
            {torneos.map(t => (
              <li key={t.id} style={{ marginBottom: 12 }}>
                <strong>{t.nombre}</strong> <span style={{ color: black, background: gold, borderRadius: 6, padding: '2px 8px', marginLeft: 8 }}>{t.equipos} equipos</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Ver reportes</button>
      </aside>
    </div>
  );
}