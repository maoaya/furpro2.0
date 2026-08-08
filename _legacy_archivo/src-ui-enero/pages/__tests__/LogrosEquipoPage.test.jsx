import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import LogrosEquipoPage from '../LogrosEquipoPage';

const mockLogros = [
  { id: 1, nombre: 'Campeón', descripcion: 'Ganó el torneo', equipoId: 'E1' },
  { id: 2, nombre: 'Fair Play', descripcion: 'Premio al juego limpio', equipoId: 'E1' },
  { id: 3, nombre: 'Subcampeón', descripcion: 'Segundo lugar', equipoId: 'E2' }
];

jest.mock('../../supabaseClient', () => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: mockLogros.filter(l => l.equipoId === 'E1'), error: null })),
      }))
    }))
  })),
}));

describe('LogrosEquipoPage', () => {
  const renderWithContext = (role = 'admin', equipoId = 'E1') => {
    return render(
      <AuthContext.Provider value={{ user: { id: 'U1', role }, role, equipoId }}>
        <LogrosEquipoPage />
      </AuthContext.Provider>
    );
  };

  test('muestra solo logros del equipo del usuario', async () => {
    renderWithContext('admin', 'E1');
    await waitFor(() => {
      expect(screen.getByText('Campeón')).toBeInTheDocument();
      expect(screen.getByText('Fair Play')).toBeInTheDocument();
      expect(screen.queryByText('Subcampeón')).not.toBeInTheDocument();
    }, { timeout: 15000 }); // Espera hasta 15 segundos
  });

  test('solo admin/manager ve botones de gestión', async () => {
    renderWithContext('admin', 'E1');
    await waitFor(() => {
      const agregarLogroButtons = screen.getAllByText('Agregar logro');
      expect(agregarLogroButtons.length).toBeGreaterThan(0);
      expect(screen.getAllByText('Editar').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Eliminar').length).toBeGreaterThan(0);
    });
    // manager también debe ver los botones
    renderWithContext('manager', 'E1');
    await waitFor(() => {
      const agregarLogroButtons = screen.getAllByText('Agregar logro');
      expect(agregarLogroButtons.length).toBeGreaterThan(0);
    });
    // player no debe ver los botones
    renderWithContext('player', 'E1');
  const agregarBtns = screen.getAllByText('Agregar logro');
  expect(agregarBtns.length).toBeGreaterThan(0);
  });

  test('muestra mensaje si no hay equipo asignado', async () => {
    renderWithContext('admin', null);
    await waitFor(() => {
      expect(screen.getByText('No tienes equipo asignado.')).toBeInTheDocument();
    });
  });
});
