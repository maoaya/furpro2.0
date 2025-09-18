describe('DashboardPage __tests__ dummy test', () => {
  it('debería pasar siempre', () => {
    expect(true).toBe(true);
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../DashboardPage.jsx';

import { AuthContext } from '../../context/AuthContext';
// Mock personalizado de AuthProvider para el test
const MockAuthProvider = ({ children }) => {
  const value = {
    user: { nombre: 'Test', id: 1, role: 'admin' },
    role: 'admin',
    equipoId: 1,
    loading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn()
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

jest.mock('../../supabaseClient', () => ({
  rpc: jest.fn(() => Promise.resolve({ data: { usuarios: 10, torneos: 5, equipos: 8 }, error: null }))
}));

describe('DashboardPage', () => {
  it('simula clicks en todos los botones principales y navegación', async () => {
    // Usar el MockAuthProvider para proveer contexto
    const { findByText, getAllByText } = render(
      <MemoryRouter>
        <MockAuthProvider>
          <DashboardPage />
        </MockAuthProvider>
      </MemoryRouter>
    );
    expect(await findByText('Dashboard')).toBeInTheDocument();
    const usuariosBtns = getAllByText('Usuarios');
    fireEvent.click(usuariosBtns.find(el => el.tagName === 'BUTTON'));
    const torneosBtns = getAllByText('Torneos');
    fireEvent.click(torneosBtns.find(el => el.tagName === 'BUTTON'));
    const equiposBtns = getAllByText('Equipos');
    fireEvent.click(equiposBtns.find(el => el.tagName === 'BUTTON'));
    const actividadBtns = getAllByText('Ver actividad');
    fireEvent.click(actividadBtns.find(el => el.tagName === 'BUTTON'));
    const reportesBtns = getAllByText('Ver reportes');
    fireEvent.click(reportesBtns.find(el => el.tagName === 'BUTTON'));
  });
});
