import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RankingCampeonatos from '../RankingCampeonatos.jsx';

describe('RankingCampeonatos component', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          status: 'ok',
          ranking: [
            { id: 1, nombre: 'Liga Profesional', categoria: 'Primera División', estado: 'activo', fecha_inicio: '2025-03-01', total_equipos: 20, total_partidos: 380, total_visualizaciones: 20000, ranking: 94.3 },
            { id: 2, nombre: 'Copa Nacional Sub-20', categoria: 'Sub-20', estado: 'finalizado', fecha_inicio: '2025-01-10', total_equipos: 16, total_partidos: 64, total_visualizaciones: 8000, ranking: 82.0 }
          ]
        })
      })
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('renderiza y muestra cards de campeonatos', async () => {
    render(<RankingCampeonatos />);

    expect(screen.getByText('🏆 Ranking de Campeonatos')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Liga Profesional')).toBeInTheDocument();
      expect(screen.getByText('Copa Nacional Sub-20')).toBeInTheDocument();
    });
  });

  test('aplica filtros y llama a la API con parámetros', async () => {
    render(<RankingCampeonatos />);

  const estado = screen.getByRole('combobox');
    const categoria = screen.getByPlaceholderText('Categoría (Liga Profesional, Copa, etc.)');
    const fechaDesde = screen.getByPlaceholderText('Fecha inicio desde');
    const fechaHasta = screen.getByPlaceholderText('Fecha inicio hasta');
    const btnFiltrar = screen.getByText('Filtrar');

    fireEvent.change(estado, { target: { value: 'activo' } });
    fireEvent.change(categoria, { target: { value: 'Sub-20' } });
    fireEvent.change(fechaDesde, { target: { value: '2025-01-01' } });
    fireEvent.change(fechaHasta, { target: { value: '2025-06-30' } });
    fireEvent.click(btnFiltrar);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const url = (global.fetch).mock.calls.pop()[0];
      expect(url).toContain('/api/ranking/campeonatos');
      expect(url).toContain('estado=activo');
      expect(url).toContain('categoria=Sub-20');
      expect(url).toContain('fechaInicioDesde=2025-01-01');
      expect(url).toContain('fechaInicioHasta=2025-06-30');
    });
  });
});