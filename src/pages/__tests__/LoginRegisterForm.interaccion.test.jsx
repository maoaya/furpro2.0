describe('LoginRegisterForm interacción de botones', () => {
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginRegisterForm from '../LoginRegisterForm.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { MemoryRouter } from 'react-router-dom';

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


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginRegisterForm from '../LoginRegisterForm.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { MemoryRouter } from 'react-router-dom';

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

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginRegisterForm from '../LoginRegisterForm.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { MemoryRouter } from 'react-router-dom';

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

  it('al hacer click en "Registro completo" navega a /registro-nuevo', () => {
    customRender(<LoginRegisterForm />);
    const btn = screen.getByTestId('btn-registro-completo');
    fireEvent.click(btn);
    setTimeout(() => {
      expect(window.location.assign).toHaveBeenCalledWith('/registro-nuevo');
    }, 200);
  });

  it('al hacer click en "Crear usuario de emergencia" navega a /registro-nuevo', () => {
    customRender(<LoginRegisterForm />);
    const btn = screen.getByTestId('btn-crear-usuario-backup');
    fireEvent.click(btn);
    setTimeout(() => {
      expect(window.location.assign).toHaveBeenCalledWith('/registro-nuevo');
    }, 200);
  });

  it('al hacer click en "Usar Email y Contraseña" muestra el formulario de email', () => {
    customRender(<LoginRegisterForm />);
    const btn = screen.getByTestId('btn-email-form');
    fireEvent.click(btn);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
  });
});
