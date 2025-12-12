import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EquiposPage from './EquiposPage.jsx';

const mockAuthValue = {
  user: { id: '123', email: 'test@futpro.com' },
  role: 'usuario',
  equipoId: null,
  loading: false,
  error: null
};

describe('EquiposPage', () => {
  test('renderiza sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthValue}>
          <EquiposPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });
});