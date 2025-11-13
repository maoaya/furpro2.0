import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginRegisterForm from './LoginRegisterForm.jsx';

// Mock de supabaseClient con getSession
jest.mock('../supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: jest.fn(async () => ({ data: { session: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } }))
    }
  }
}));

// Mock para AuthContext
jest.mock('../context/AuthContext.jsx', () => ({
  AuthContext: {
    Consumer: ({ children }) => children({ 
      loginWithGoogle: jest.fn(), 
      loginWithFacebook: jest.fn() 
    }),
    Provider: ({ children }) => children
  },
  useAuth: () => ({
    loginWithGoogle: jest.fn(),
    loginWithFacebook: jest.fn()
  })
}));

// Wrapper para Router context
const RouterWrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

describe('LoginRegisterForm', () => {
  test('renderiza correctamente', async () => {
    render(<RouterWrapper><LoginRegisterForm /></RouterWrapper>);
    expect(screen.getByText(/FutPro/i)).toBeInTheDocument();
  });
});