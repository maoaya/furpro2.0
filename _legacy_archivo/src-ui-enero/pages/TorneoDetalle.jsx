import React, { useState } from 'react';
import Button from './Button';
import './TorneoDetalle.css';

const gold = '#FFD700';
const black = '#222';

const torneoDemo = {
  nombre: 'Liga FutPro',
  estado: 'Activo',
  actividad: [8, 7, 9, 8, 7],
  equipos: ['FutPro FC', 'Oro United', 'Black Stars'],
};

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

const TorneoDetalle = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      {/* Panel izquierdo: navegación */}
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Panel de Torneo</h2>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Consultar</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Actualizar</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Ver historial</Button>
      </aside>

      {/* Feed central: información del torneo */}
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ marginBottom: 12 }}>Torneo: {torneoDemo.nombre}</h1>
          <h3>Estado: {torneoDemo.estado}</h3>
          <p>Equipos: {torneoDemo.equipos.join(', ')}</p>
          <div style={{ margin: '24px 0' }}>
            <strong>Actividad reciente:</strong>
            <BarChart data={torneoDemo.actividad} />
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
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 8, transition: 'background 0.3s, color 0.3s' }}>Editar torneo</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Ver clasificaciones</Button>
      </aside>
    </div>
  );
};

export default TorneoDetalle;
