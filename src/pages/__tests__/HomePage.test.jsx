jest.mock('../../supabaseClient');
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../HomePage.jsx';

beforeAll(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: async () => ({ gallery: [] })
  }));
});

import { AuthContext } from '../../context/AuthContext';
const mockAuthValue = {
  user: { nombre: 'Test', id: 1, role: 'admin', email: 'test@futpro.com', avatar: '', equipos: [] },
  role: 'admin',
  equipoId: 1,
  loading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: true,
  setUser: jest.fn(),
  setRole: jest.fn(),
  setEquipoId: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn()
};

describe('Simulación completa HomePage', () => {
  test('Renderiza cabecera y navegación inferior', () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    // Cabecera muestra FutPro o mensaje de bienvenida actual
    expect(screen.getByText(/FutPro/i)).toBeInTheDocument();
    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
    // Navegación inferior con botones
    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ofertas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /TV/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calendario/i })).toBeInTheDocument();
  });

  it('simula clicks en la navegación inferior', async () => {
    render(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Home/i }));
    fireEvent.click(screen.getByRole('button', { name: /Ofertas/i }));
    fireEvent.click(screen.getByRole('button', { name: /TV/i }));
    fireEvent.click(screen.getByRole('button', { name: /Calendario/i }));
  });
});
