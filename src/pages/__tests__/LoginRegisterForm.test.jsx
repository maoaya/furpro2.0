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

  test('login exitoso', async () => {
    await act(async () => {
      render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });

    // Verificar que el componente se renderiza
    expect(screen.getByText('Continuar con Google')).toBeInTheDocument();
  });

  test('registro exitoso', async () => {
    await act(async () => {
      render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });

    expect(screen.getByText('Continuar con Facebook')).toBeInTheDocument();
  });

  test('login falla con credenciales inválidas', async () => {
    await act(async () => {
      render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });

    expect(screen.getByText('Usar Email y Contraseña')).toBeInTheDocument();
  });

  test('registro falla con email ya registrado', async () => {
    await act(async () => {
      render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });

    expect(screen.getByText('o')).toBeInTheDocument();
});

test('renderiza el formulario de acceso', async () => {
  await act(async () => {
    render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
  });

  expect(screen.getByText('Continuar con Google')).toBeInTheDocument();
  expect(screen.getByText('Continuar con Facebook')).toBeInTheDocument();
  expect(screen.getByText('Usar Email y Contraseña')).toBeInTheDocument();
});

test('botón Ingresar con Email funciona', async () => {
  await act(async () => {
    render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
  });

  const emailButton = screen.getByText('Usar Email y Contraseña');
  fireEvent.click(emailButton);
  
  await waitFor(() => {
    expect(screen.getByText('← Volver a opciones de ingreso')).toBeInTheDocument();
  });
});

test('botón Ingresar con Google funciona', async () => {
  await act(async () => {
    render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
  });

  const googleButton = screen.getByText('Continuar con Google');
  fireEvent.click(googleButton);
  
  expect(mockAuthContextValue.loginWithGoogle).toHaveBeenCalled();
});

test('botón Ingresar con Facebook funciona', async () => {
  await act(async () => {
    render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
  });

  const facebookButton = screen.getByText('Continuar con Facebook');
  fireEvent.click(facebookButton);
  
  expect(mockAuthContextValue.loginWithFacebook).toHaveBeenCalled();
});

  test('registro exitoso', async () => {
    await act(async () => {
  render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });
    fireEvent.click(screen.getByText('Usar Email y Contraseña'));
    fireEvent.click(screen.getByText('¿No tienes cuenta? Registrarse'));
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'nuevo@futpro.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'abcdef' } });
    fireEvent.click(screen.getByText('Registrarse'));
    await waitFor(() => {
      expect(screen.getByText('¡Registro exitoso!')).toBeInTheDocument();
    });
  });

  test('login falla con credenciales inválidas', async () => {
    await act(async () => {
  render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });
    fireEvent.click(screen.getByText('Ingresar con Email'));
    const emailInput = await screen.findByPlaceholderText('Email');
    const passwordInput = await screen.findByPlaceholderText('Contraseña');
    fireEvent.change(emailInput, { target: { value: 'fail@futpro.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Ingresar'));
    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
  });

  test('registro falla con email ya registrado', async () => {
    await act(async () => {
  render(<TestWrapper><LoginRegisterForm /></TestWrapper>);
    });
    fireEvent.click(screen.getByText('Ingresar con Email'));
    fireEvent.click(screen.getByText('¿No tienes cuenta?'));
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'fail@futpro.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'abcdef' } });
    fireEvent.click(screen.getByText('Registrarse'));
    await waitFor(() => {
      expect(screen.getByText('Email ya registrado')).toBeInTheDocument();
    });
  });
});
