import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RankingDashboard from '../RankingDashboard.jsx';

jest.mock('../RankingJugadores.jsx', () => ({
  __esModule: true,
  default: function MockRankingJugadores() {
    return <div>Mock Ranking Jugadores</div>;
  }
}));
jest.mock('../RankingCampeonatos.jsx', () => ({
  __esModule: true,
  default: function MockRankingCampeonatos() {
    return <div>Mock Ranking Campeonatos</div>;
  }
}));

describe('RankingDashboard', () => {
  test('cambia de pestañas entre jugadores y campeonatos', () => {
    render(<RankingDashboard />);

    expect(screen.getByText('Mock Ranking Jugadores')).toBeInTheDocument();

    const tabCampeonatos = screen.getByText('🏆 Ranking de Campeonatos');
    fireEvent.click(tabCampeonatos);

    expect(screen.getByText('Mock Ranking Campeonatos')).toBeInTheDocument();
  });
});