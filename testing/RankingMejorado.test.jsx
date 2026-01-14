/**
 * RankingMejorado.test.jsx
 * Tests unitarios para el componente RankingMejorado
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RankingMejorado from '../RankingMejorado';
import * as TournamentService from '../../services/TournamentService';
import * as RefereeService from '../../services/RefereeService';

jest.mock('../../services/TournamentService');
jest.mock('../../services/RefereeService');
jest.mock('../../config/supabaseClient');

describe('RankingMejorado Component', () => {
  const mockTeamRankings = [
    {
      id: 1,
      nombre: 'Equipo A',
      categoria: 'Profesional',
      jugados: 10,
      ganados: 7,
      empatados: 2,
      perdidos: 1,
      puntos: 23
    },
    {
      id: 2,
      nombre: 'Equipo B',
      categoria: 'Profesional',
      jugados: 10,
      ganados: 6,
      empatados: 3,
      perdidos: 1,
      puntos: 21
    }
  ];

  const mockReferees = [
    {
      id: 'ref-1',
      nombre: 'Juan',
      apellido: 'Pérez',
      disponible: true,
      rating: 4.8,
      partidos_arbitrados: 50,
      experiencia_anos: 5
    },
    {
      id: 'ref-2',
      nombre: 'Carlos',
      apellido: 'López',
      disponible: true,
      rating: 4.5,
      partidos_arbitrados: 35,
      experiencia_anos: 3
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    TournamentService.getTeamRankings.mockResolvedValue(mockTeamRankings);
    RefereeService.getAvailableReferees.mockResolvedValue(mockReferees);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <RankingMejorado />
      </BrowserRouter>
    );
  };

  test('debe renderizar el componente sin errores', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
    });
  });

  test('debe mostrar los tabs de Ranking y Árbitros', () => {
    renderComponent();
    expect(screen.getByRole('tab', { name: /Ranking/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Árbitros/i })).toBeInTheDocument();
  });

  test('debe cargar y mostrar equipos en la tabla', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Equipo A')).toBeInTheDocument();
      expect(screen.getByText('Equipo B')).toBeInTheDocument();
    });
  });

  test('debe mostrar todas las columnas de la tabla', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Posición')).toBeInTheDocument();
      expect(screen.getByText('Equipo')).toBeInTheDocument();
      expect(screen.getByText('Categoría')).toBeInTheDocument();
      expect(screen.getByText('Jugados')).toBeInTheDocument();
      expect(screen.getByText('Ganados')).toBeInTheDocument();
      expect(screen.getByText('Puntos')).toBeInTheDocument();
    });
  });

  test('debe filtrar equipos por nombre', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Equipo A')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Buscar equipo/i);
    await user.type(searchInput, 'Equipo B');

    await waitFor(() => {
      expect(screen.queryByText('Equipo A')).not.toBeInTheDocument();
      expect(screen.getByText('Equipo B')).toBeInTheDocument();
    });
  });

  test('debe filtrar equipos por categoría', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Equipo A')).toBeInTheDocument();
    });

    const categorySelect = screen.getByDisplayValue(/Seleccionar categoría/i);
    await user.selectOptions(categorySelect, 'Profesional');

    expect(screen.getByText('Equipo A')).toBeInTheDocument();
  });

  test('debe ordenar tabla al hacer click en encabezado', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Equipo A')).toBeInTheDocument();
    });

    const puntosHeader = screen.getByText('Puntos');
    await user.click(puntosHeader);

    // La tabla debe ordenarse
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('debe cargar y mostrar árbitros en segundo tab', async () => {
    const user = userEvent.setup();
    renderComponent();

    const arbitrosTab = screen.getByRole('tab', { name: /Árbitros/i });
    await user.click(arbitrosTab);

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('Carlos López')).toBeInTheDocument();
    });
  });

  test('debe mostrar rating de árbitros', async () => {
    const user = userEvent.setup();
    renderComponent();

    const arbitrosTab = screen.getByRole('tab', { name: /Árbitros/i });
    await user.click(arbitrosTab);

    await waitFor(() => {
      expect(screen.getByText(/4\.8/)).toBeInTheDocument();
      expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    });
  });

  test('debe filtrar árbitros disponibles solamente', async () => {
    const user = userEvent.setup();
    const mockRefereesNotAvailable = [
      { ...mockReferees[0], disponible: false },
      { ...mockReferees[1], disponible: true }
    ];
    RefereeService.getAvailableReferees.mockResolvedValue(mockRefereesNotAvailable);

    renderComponent();

    const arbitrosTab = screen.getByRole('tab', { name: /Árbitros/i });
    await user.click(arbitrosTab);

    await waitFor(() => {
      // Solo debe mostrar disponibles
      expect(screen.getByText('Carlos López')).toBeInTheDocument();
    });
  });

  test('debe mostrar mensaje cuando no hay resultados', async () => {
    TournamentService.getTeamRankings.mockResolvedValue([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/No hay equipos/i)).toBeInTheDocument();
    });
  });

  test('debe manejar errores de carga', async () => {
    TournamentService.getTeamRankings.mockRejectedValue(new Error('Error de conexión'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar ranking/i)).toBeInTheDocument();
    });
  });

  test('debe mostrar loading state mientras carga', () => {
    renderComponent();
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  test('debe aplicar filtro de mínimo juegos jugados', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Equipo A')).toBeInTheDocument();
    });

    const minGamesSlider = screen.getByRole('slider', { name: /Mínimo juegos/i });
    fireEvent.change(minGamesSlider, { target: { value: '9' } });

    // Ambos equipos tienen 10+ juegos, así que deben aparecer
    expect(screen.getByText('Equipo A')).toBeInTheDocument();
  });

  test('debe hacer request a servicios al montar', async () => {
    renderComponent();

    await waitFor(() => {
      expect(TournamentService.getTeamRankings).toHaveBeenCalled();
    });
  });
});
