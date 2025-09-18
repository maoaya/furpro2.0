import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RankingJugadores from '../RankingJugadores.jsx';

describe('RankingJugadores component', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          status: 'ok',
          ranking: [
            { id: 1, nombre: 'Juan Pérez', equipo_nombre: 'FC Barcelona', edad: 25, goles: 15, asistencias: 7, partidos_jugados: 20, ranking: 95.4 },
            { id: 2, nombre: 'Carlos López', equipo_nombre: 'Real Madrid', edad: 23, goles: 10, asistencias: 10, partidos_jugados: 18, ranking: 88.2 }
          ]
        })
      })
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('renderiza y muestra una tabla con jugadores', async () => {
    render(<RankingJugadores />);

    expect(screen.getByText('🏆 Ranking de Jugadores')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('Carlos López')).toBeInTheDocument();
    });
  });

  test('aplica filtros y llama a la API con parámetros', async () => {
    render(<RankingJugadores />);

    const edadMin = screen.getByPlaceholderText('Edad mínima');
    const edadMax = screen.getByPlaceholderText('Edad máxima');
    const equipoId = screen.getByPlaceholderText('ID del equipo');
    const btnFiltrar = screen.getByText('Filtrar');

    fireEvent.change(edadMin, { target: { value: '20' } });
    fireEvent.change(edadMax, { target: { value: '30' } });
    fireEvent.change(equipoId, { target: { value: '1' } });
    fireEvent.click(btnFiltrar);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const url = (global.fetch).mock.calls.pop()[0];
      expect(url).toContain('/api/ranking/jugadores');
      expect(url).toContain('edadMin=20');
      expect(url).toContain('edadMax=30');
      expect(url).toContain('equipoId=1');
    });
  });
});