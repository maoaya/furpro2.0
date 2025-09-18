import React from 'react';

export default function RankingEstadisticasPanel({ estadisticas }) {
  const estadisticasMock = [
    { id: 1, nombre: 'Juan', goles: 20, asistencias: 8 },
    { id: 2, nombre: 'Maria', goles: 15, asistencias: 12 }
  ];
  const estadisticasFinal = estadisticas && estadisticas.length > 0 ? estadisticas : estadisticasMock;
  return (
    <div className="ranking-estadisticas-panel" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, margin: '24px 0' }}>
      <h3>Estadísticas de Ranking</h3>
      <table>
        <thead>
          <tr><th>Nombre</th><th>Goles</th><th>Asistencias</th></tr>
        </thead>
        <tbody>
          {estadisticasFinal.map(e => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{e.goles}</td>
              <td>{e.asistencias}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { render, screen } from '@testing-library/react';

describe('RankingEstadisticasPanel', () => {
  it('renderiza estadísticas y panel', () => {
    render(<RankingEstadisticasPanel estadisticas={[{id:1,nombre:'Juan',goles:20,asistencias:8}]} />);
    expect(screen.getByText('Estadísticas de Ranking')).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });
});
