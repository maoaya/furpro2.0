import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginRegisterForm from '../LoginRegisterForm.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

// Mock de Supabase con getSession
jest.mock('../../config/supabase', () => ({
  __esModule: true,
  supabase: {
    auth: {
      getSession: jest.fn(async () => ({ data: { session: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } }))
    }
  }
}));

const mockAuthValue = {
  user: null,
  loginWithGoogle: jest.fn(),
  loginWithFacebook: jest.fn(),
  loading: false,
  error: null
};

const TestWrapper = ({ children }) => (
  <MemoryRouter>
    <AuthContext.Provider value={mockAuthValue}>
      {children}
    </AuthContext.Provider>
  </MemoryRouter>
);

describe('LoginRegisterForm diseño', () => {
  it('renderiza el componente sin errores', () => {
    render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    expect(screen.getByText(/FutPro/i)).toBeInTheDocument();
  });
  
  it('muestra botón de Google', () => {
    render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    expect(screen.getByText(/Continuar con Google/i)).toBeInTheDocument();
  });
  
  it('muestra opción de email', () => {
    render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    expect(screen.getByText(/con email/i)).toBeInTheDocument();
  });
});
