import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#222';

export default function ConfiguracionPage() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [tema, setTema] = useState('oscuro');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Configuración</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Guardar</button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Configuración</h1>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label>
              <input type="checkbox" checked={notificaciones} onChange={e => setNotificaciones(e.target.checked)} /> Activar notificaciones
            </label>
            <label>
              Tema:
              <select value={tema} onChange={e => setTema(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${black}`, marginLeft: 8 }}>
                <option value="oscuro">Oscuro</option>
                <option value="claro">Claro</option>
              </select>
            </label>
            <button type="submit" style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', marginTop: 24 }}>Guardar cambios</button>
          </form>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Ver reportes</button>
      </aside>
    </div>
  );
}