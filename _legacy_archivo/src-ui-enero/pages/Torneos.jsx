import React, { useState } from 'react';
import Button from '../components/Button';
import './Torneos.jsx.css';

const gold = '#FFD700';
const black = '#222';

const torneosDemo = [
  { nombre: 'Liga FutPro', estado: 'Activo', actividad: [8, 7, 9, 8, 7] },
  { nombre: 'Copa Oro', estado: 'Finalizado', actividad: [6, 8, 7, 6, 8] },
  { nombre: 'Supercopa', estado: 'En curso', actividad: [7, 9, 8, 7, 9] },
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

const Torneos = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      {/* Panel izquierdo: navegación */}
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Panel de Torneos</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {torneosDemo.map((t, idx) => (
            <li key={t.nombre} style={{ margin: '18px 0' }}>
                <Button
                  style={{
                    background: selected === idx ? gold : black,
                    color: selected === idx ? black : gold,
                    border: `1px solid ${gold}`,
                    borderRadius: 8,
                    padding: '8px 16px',
                    width: '100%',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s, color 0.3s'
                  }}
                  onClick={() => setSelected(idx)}
                >
                  {t.nombre}
                </Button>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 32 }}>
            <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Consultar</Button>
            <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Actualizar</Button>
            <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Ver historial</Button>
        </div>
      </aside>

      {/* Feed central: información del torneo */}
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ marginBottom: 12 }}>Torneo: {torneosDemo[selected].nombre}</h1>
          <h3>Estado: {torneosDemo[selected].estado}</h3>
          <div style={{ margin: '24px 0' }}>
            <strong>Actividad reciente:</strong>
            <BarChart data={torneosDemo[selected].actividad} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              <Button style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', transition: 'background 0.3s, color 0.3s' }}>Acción rápida</Button>
              <Button style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', transition: 'background 0.3s, color 0.3s' }}>Ver partidos</Button>
          </div>
        </div>
      </main>

      {/* Panel derecho: acciones rápidas */}
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '18px 0' }}>
              <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Agregar torneo</Button>
          </li>
          <li style={{ margin: '18px 0' }}>
              <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Ver clasificaciones</Button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Torneos;
