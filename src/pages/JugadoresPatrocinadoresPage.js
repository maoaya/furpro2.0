import React, { useState } from 'react';
import './JugadoresPatrocinadoresPage.css';

const gold = '#FFD700';
const black = '#222';

const jugadoresDemo = [
  { nombre: 'Juan Pérez', patrocinador: 'Nike', actividad: [5, 8, 6, 7, 9] },
  { nombre: 'Carlos Ruiz', patrocinador: 'Adidas', actividad: [7, 6, 8, 5, 7] },
  { nombre: 'Luis Gómez', patrocinador: 'Puma', actividad: [6, 7, 5, 8, 6] },
];

function BarChart({ data }) {
  return (
    <svg width="100%" height="40" style={{ background: black }}>
      {data.map((val, i) => (
        <rect
          key={i}
          x={i * 22}
          y={40 - val * 4}
          width={20}
          height={val * 4}
          fill={gold}
          rx={3}
        />
      ))}
    </svg>
  );
}

const JugadoresPatrocinadoresPage = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      {/* Panel izquierdo: navegación */}
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Panel de Jugadores</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jugadoresDemo.map((j, idx) => (
            <li key={j.nombre} style={{ margin: '18px 0' }}>
              <button
                style={{
                  background: selected === idx ? gold : black,
                  color: selected === idx ? black : gold,
                  border: `1px solid ${gold}`,
                  borderRadius: 8,
                  padding: '8px 16px',
                  width: '100%',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
                onClick={() => setSelected(idx)}
              >
                {j.nombre}
              </button>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 32 }}>
          <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8 }}>Consultar</button>
          <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8 }}>Actualizar</button>
          <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Ver historial</button>
        </div>
      </aside>

      {/* Feed central: información del jugador */}
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ marginBottom: 12 }}>Jugador: {jugadoresDemo[selected].nombre}</h1>
          <h3>Patrocinador: {jugadoresDemo[selected].patrocinador}</h3>
          <div style={{ margin: '24px 0' }}>
            <strong>Actividad reciente:</strong>
            <BarChart data={jugadoresDemo[selected].actividad} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }}>Acción rápida</button>
            <button style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }}>Enviar mensaje</button>
          </div>
        </div>
      </main>

      {/* Panel derecho: acciones rápidas */}
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '18px 0' }}>
            <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Agregar patrocinador</button>
          </li>
          <li style={{ margin: '18px 0' }}>
            <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }}>Ver contratos</button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default JugadoresPatrocinadoresPage;
