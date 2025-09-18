import React from 'react';
import { render, screen } from '@testing-library/react';
import TransmisionesPanel from './TransmisionesPanel';

describe('TransmisionesPanel', () => {
  test('renderiza el título y las transmisiones mock', () => {
    render(<TransmisionesPanel />);
    expect(screen.getByText('Transmisiones en Vivo')).toBeInTheDocument();
    expect(screen.getByText('Final Torneo Clausura')).toBeInTheDocument();
    expect(screen.getByText('Partido Tigres vs Leones')).toBeInTheDocument();
    expect(screen.getAllByText('Ver transmisión').length).toBe(2);
  });

  test('renderiza transmisiones personalizadas', () => {
    const transmisiones = [
      { id: 10, titulo: 'Supercopa 2025', url: 'https://youtube.com/supercopa' }
    ];
    render(<TransmisionesPanel transmisiones={transmisiones} />);
    expect(screen.getByText('Supercopa 2025')).toBeInTheDocument();
    expect(screen.getByText('Ver transmisión')).toBeInTheDocument();
  });
});
