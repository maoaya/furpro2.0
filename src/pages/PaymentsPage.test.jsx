import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import PaymentsPage from './PaymentsPage.jsx';

const mockAuthValue = {
  user: { id: '123', email: 'test@futpro.com' },
  role: 'admin',
  equipoId: null,
  loading: false,
  error: null
};

describe('PaymentsPage', () => {
  test('renderiza sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthValue}>
          <PaymentsPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });
});