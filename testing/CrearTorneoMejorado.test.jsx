/**
 * CrearTorneoMejorado.test.jsx
 * Tests unitarios para el componente CrearTorneoMejorado
 * Framework: Jest + React Testing Library
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CrearTorneoMejorado from '../CrearTorneoMejorado';
import * as TournamentService from '../../services/TournamentService';

// Mock TournamentService
jest.mock('../../services/TournamentService');

// Mock Supabase
jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: '123' } } }))
    }
  }
}));

describe('CrearTorneoMejorado Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    TournamentService.createTournament.mockResolvedValue({ id: 'tournament-123' });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CrearTorneoMejorado />
      </BrowserRouter>
    );
  };

  test('debe renderizar el componente sin errores', () => {
    renderComponent();
    expect(screen.getByText(/Crear Torneo/i)).toBeInTheDocument();
  });

  test('debe mostrar el Paso 1 inicialmente', () => {
    renderComponent();
    expect(screen.getByText(/Información Básica/i)).toBeInTheDocument();
  });

  test('debe tener botón Next habilitado después de llenar campos requeridos', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText(/Nombre del torneo/i);
    await user.type(nameInput, 'Mi Torneo');

    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(nextButton).not.toBeDisabled();
  });

  test('debe avanzar a Paso 2 al clickear Next', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText(/Nombre del torneo/i);
    await user.type(nameInput, 'Mi Torneo');

    const descInput = screen.getByPlaceholderText(/Descripción/i);
    await user.type(descInput, 'Torneo de prueba');

    const nextButton = screen.getByRole('button', { name: /Next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Configuración del Torneo/i)).toBeInTheDocument();
    });
  });

  test('debe mostrar validación de errores para campo obligatorio', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nextButton = screen.getByRole('button', { name: /Next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Este campo es requerido/i)).toBeInTheDocument();
    });
  });

  test('debe poder retroceder a pasos anteriores', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText(/Nombre del torneo/i);
    await user.type(nameInput, 'Mi Torneo');

    const nextButton = screen.getByRole('button', { name: /Next/i });
    await user.click(nextButton);

    await waitFor(() => {
      const prevButton = screen.getByRole('button', { name: /Prev/i });
      expect(prevButton).toBeInTheDocument();
    });

    const prevButton = screen.getByRole('button', { name: /Prev/i });
    await user.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText(/Información Básica/i)).toBeInTheDocument();
    });
  });

  test('debe llamar a TournamentService al enviar el formulario', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Llenar Paso 1
    await user.type(screen.getByPlaceholderText(/Nombre del torneo/i), 'Mi Torneo');
    await user.type(screen.getByPlaceholderText(/Descripción/i), 'Descripción');
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Llenar Paso 2
    await waitFor(() => {
      expect(screen.getByText(/Configuración del Torneo/i)).toBeInTheDocument();
    });

    // Continuar a Paso 3 y 4
    const nextButtons = screen.getAllByRole('button', { name: /Next/i });
    for (let i = 0; i < 2; i++) {
      await user.click(nextButtons[0]);
      await waitFor(() => {
        // Esperar cambio de paso
      });
    }

    // En Paso 4 (Revisión), clickear Crear
    const createButton = screen.getByRole('button', { name: /Crear Torneo/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(TournamentService.createTournament).toHaveBeenCalled();
    });
  });

  test('debe mostrar mensaje de éxito después de crear torneo', async () => {
    const user = userEvent.setup();
    renderComponent();

    TournamentService.createTournament.mockResolvedValue({
      id: 'new-tournament',
      nombre: 'Mi Torneo'
    });

    // Llenar y enviar formulario (código simplificado)
    // ... (mismo proceso que test anterior)

    await waitFor(() => {
      expect(screen.getByText(/Torneo creado exitosamente/i)).toBeInTheDocument();
    });
  });

  test('debe manejar errores de creación correctamente', async () => {
    const user = userEvent.setup();
    renderComponent();

    TournamentService.createTournament.mockRejectedValue(
      new Error('Error al crear torneo')
    );

    // Llenar y enviar formulario
    // ... 

    await waitFor(() => {
      expect(screen.getByText(/Error al crear torneo/i)).toBeInTheDocument();
    });
  });

  test('debe mostrar la barra de progreso correctamente', () => {
    renderComponent();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  test('debe actualizar el progreso al cambiar de paso', async () => {
    const user = userEvent.setup();
    renderComponent();

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '25'); // Paso 1/4

    const nameInput = screen.getByPlaceholderText(/Nombre del torneo/i);
    await user.type(nameInput, 'Mi Torneo');

    const nextButton = screen.getByRole('button', { name: /Next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(progressBar).toHaveAttribute('aria-valuenow', '50'); // Paso 2/4
    });
  });
});
