import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PaymentsPage from '../PaymentsPage.jsx';
jest.mock('../../supabaseClient', () => ({
  from: jest.fn(() => ({ select: jest.fn(() => Promise.resolve({ data: [
    { id: 1, concepto: 'Inscripción', usuario: 'Natico', monto: 100, fecha: '2025-08-22' },
    { id: 2, concepto: 'Mensualidad', usuario: 'User2', monto: 50, fecha: '2025-08-21' }
  ], error: null }) ) }))
}));

import { AuthContext } from '../../context/AuthContext';

describe('PaymentsPage', () => {
  it('simula clicks en todos los botones y navegación', async () => {
    const mockUser = { id: 1, email: 'test@futpro.com', role: 'player' };
    const contextValue = { user: mockUser, role: 'player', equipoId: 1, loading: false, error: null };
    const { findByText } = render(
      <AuthContext.Provider value={contextValue}>
        <MemoryRouter>
          <PaymentsPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(await findByText('Natico')).toBeInTheDocument();
    fireEvent.click(await findByText('Actualizar'));
    fireEvent.click(await findByText('Nuevo pago'));
  const verBtns = screen.getAllByText('Ver');
  fireEvent.click(verBtns.find(el => el.tagName === 'BUTTON'));
  const editarBtns = await screen.findAllByText('Editar');
  fireEvent.click(editarBtns[0]); // Click en el primer botón 'Editar'
  fireEvent.click(await findByText('Ver actividad'));
  fireEvent.click(await findByText('Ver reportes'));
  }, 15000);
});
