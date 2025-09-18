import React, { useState } from 'react';
import './SoportePage.css';

const gold = '#FFD700';
const black = '#222';

const SoportePage = () => {
  const [mensaje, setMensaje] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      {/* Panel izquierdo: navegación */}
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Panel de Soporte</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8 }}>Consultar</button>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8 }}>Actualizar</button>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Ver historial</button>
      </aside>

      {/* Feed central: formulario de soporte */}
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ marginBottom: 12 }}>Soporte FutPro</h1>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label>
              Email:
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
            </label>
            <label>
              Mensaje:
              <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }} />
            </label>
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              <button type="submit" style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }}>Enviar mensaje</button>
              <button type="button" style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }}>Cancelar</button>
            </div>
          </form>
        </div>
      </main>

      {/* Panel derecho: acciones rápidas */}
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8 }}>Ver reportes</button>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Contactar soporte</button>
      </aside>
    </div>
  );
};

export default SoportePage;