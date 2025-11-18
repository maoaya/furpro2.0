import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginRegisterForm from '../LoginRegisterFormClean.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { MemoryRouter } from 'react-router-dom';

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

// Mock de useNavigate de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(() => {})
}));

const customRender = (ui) => {
  // Mock mínimo de AuthContext
  const authMock = {
    user: null,
    loginWithGoogle: jest.fn(),
    loginWithFacebook: jest.fn(),
    loading: false,
    error: null
  };
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <AuthContext.Provider value={authMock}>
          {ui}
        </AuthContext.Provider>
      </MemoryRouter>
    </I18nextProvider>
  );
};

describe('LoginRegisterForm interacción de botones', () => {
  beforeEach(() => {
    // Mock window.location
    delete window.location;
    window.location = { assign: jest.fn(), href: '', replace: jest.fn(), origin: 'http://localhost' };
  });

  it('muestra el botón de Google', () => {
    customRender(<LoginRegisterForm />);
    const btn = screen.getByText(/Continuar con Google/i);
    expect(btn).toBeInTheDocument();
  });

  it('muestra el botón de registro', () => {
    customRender(<LoginRegisterForm />);
    const btn = screen.getByText(/¿No tienes cuenta\? Regístrate/i);
    expect(btn).toBeInTheDocument();
  });

  it('muestra los campos de email y contraseña', () => {
    customRender(<LoginRegisterForm />);
    expect(screen.getByPlaceholderText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
  });
});
