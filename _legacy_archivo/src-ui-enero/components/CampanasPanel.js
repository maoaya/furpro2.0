import React from 'react';
import { render, screen } from '@testing-library/react';

export default function CampanasPanel({ campanas }) {
  const campanasMock = [
    { id: 1, nombre: 'Campaña FutPro', descripcion: 'Promoción especial para nuevos equipos.' },
    { id: 2, nombre: 'Campaña Premium', descripcion: 'Descuentos en membresía premium.' }
  ];
  const campanasFinal = campanas && campanas.length > 0 ? campanas : campanasMock;
  return (
    <div className="campanas-panel" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, margin: '24px 0' }}>
      <h3>Campañas y Promociones</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {campanasFinal.map((c, idx) => (
          <li key={c.id || idx} style={{ marginBottom: 10, background: '#e6f7ff', borderRadius: 8, padding: 10 }}>
            <span>{c.nombre}</span>
            <span style={{ float: 'right', color: '#222' }}>{c.descripcion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('CampanasPanel', () => {
  it('renderiza campañas y panel', () => {
    render(<CampanasPanel campanas={[{id:1,nombre:'Campaña FutPro',descripcion:'Promoción especial para nuevos equipos.'}]} />);
    expect(screen.getByText('Campañas y Promociones')).toBeInTheDocument();
    expect(screen.getByText('Campaña FutPro')).toBeInTheDocument();
    expect(screen.getByText('Promoción especial para nuevos equipos.')).toBeInTheDocument();
  });
});
