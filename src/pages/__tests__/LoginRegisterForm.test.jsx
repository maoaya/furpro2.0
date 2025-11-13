import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginRegisterForm from '../LoginRegisterForm.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

// Mock del AuthContext con todos los valores necesarios
const mockAuthContextValue = {
  user: null,
  role: 'guest',
  equipoId: null,
  userProfile: null,
  loading: false,
  error: null,
  loginWithGoogle: jest.fn(),
  loginWithFacebook: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  updateUserProfile: jest.fn()
};

// Wrapper que incluye tanto Router como AuthContext
const TestWrapper = ({ children }) => (
  <MemoryRouter>
    <AuthContext.Provider value={mockAuthContextValue}>
      {children}
    </AuthContext.Provider>
  </MemoryRouter>
);

jest.mock('../../config/supabase', () => ({
  __esModule: true,
  supabase: {
    auth: {
      getSession: jest.fn(async () => ({ data: { session: null }, error: null })),
      signInWithPassword: jest.fn(async ({ email }) => {
        if (email === 'fail@futpro.com') return { error: { message: 'Credenciales inválidas' } };
        return { error: null };
      }),
      signUp: jest.fn(async ({ email }) => {
        if (email === 'fail@futpro.com') return { error: { message: 'Email ya registrado' } };
        return { error: null };
      }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    }
  }
}));

describe('LoginRegisterForm', () => {
  beforeEach(() => {
    // Reset mocks antes de cada test
    jest.clearAllMocks();
    mockAuthContextValue.loginWithGoogle.mockReset();
    mockAuthContextValue.loginWithFacebook.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  test('renderiza el formulario con botón de Google', async () => {
    await act(async () => {
      render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });

    // Verificar que el componente se renderiza con el botón de Google
    expect(screen.getByText(/Continuar con Google/i)).toBeInTheDocument();
  });

  test('renderiza título FutPro', async () => {
    await act(async () => {
      render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });

    expect(screen.getByText(/FutPro/i)).toBeInTheDocument();
  });

  test('muestra opción de email', async () => {
    await act(async () => {
      render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });

    expect(screen.getByText(/con email/i)).toBeInTheDocument();
  });
});
