import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#222';

export default function PrivacidadPage() {
  const [aceptado, setAceptado] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Privacidad</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Aceptar</button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Política de Privacidad</h1>
          <p>Tu información está protegida y solo se usará para mejorar tu experiencia en FutPro.</p>
          <label>
            <input type="checkbox" checked={aceptado} onChange={e => setAceptado(e.target.checked)} /> Acepto la política de privacidad
          </label>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Ver reportes</button>
      </aside>
    </div>
  );
}