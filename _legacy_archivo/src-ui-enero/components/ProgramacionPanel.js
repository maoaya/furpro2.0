import React from 'react';
import { render, screen } from '@testing-library/react';

export default function ProgramacionPanel({ partidos }) {
  const partidosMock = [
    { id: 1, equipoA: 'Tigres', equipoB: 'Leones', fecha: '2025-08-24' },
    { id: 2, equipoA: 'Águilas', equipoB: 'Tigres', fecha: '2025-08-25' }
  ];
  const partidosFinal = partidos && partidos.length > 0 ? partidos : partidosMock;
  return (
    <div className="programacion-panel" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, margin: '24px 0' }}>
      <h3>Programación de Partidos</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {partidosFinal.map((p, idx) => (
          <li key={p.id || idx} style={{ marginBottom: 10, background: '#f7f7f7', borderRadius: 8, padding: 10 }}>
            <span>{p.equipoA} vs {p.equipoB}</span>
            <span style={{ float: 'right', color: '#FFD700' }}>{p.fecha}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('ProgramacionPanel', () => {
  it('renderiza partidos y panel', () => {
    render(<ProgramacionPanel partidos={[{id:1,equipoA:'Tigres',equipoB:'Leones',fecha:'2025-08-24'}]} />);
    expect(screen.getByText('Programación de Partidos')).toBeInTheDocument();
    expect(screen.getByText('Tigres vs Leones')).toBeInTheDocument();
    expect(screen.getByText('2025-08-24')).toBeInTheDocument();
  });
});
