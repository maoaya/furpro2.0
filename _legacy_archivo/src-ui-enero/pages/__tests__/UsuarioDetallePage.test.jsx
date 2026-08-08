// Mock de supabase para evitar llamadas reales (ajustado path)
jest.mock('../../supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: { id: 1, nombre: 'Test User', email: 'test@futpro.com', rol: 'admin' }, error: null })
        })
      })
    })
  }
}));


import React from 'react';
import { render } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import UsuarioDetallePage from '../UsuarioDetallePage';

beforeAll(() => {
  // Mock completo de window.location para jsdom
  const locationMock = {
    pathname: '/usuarios/1',
    href: '',
    origin: 'http://localhost',
    reload: jest.fn(),
    assign: jest.fn(),
    replace: jest.fn(),
  };
  delete window.location;
  window.location = locationMock;
});

describe('UsuarioDetallePage', () => {
  it('renderiza sin crashear', () => {
    expect(() => {
      render(
        <AuthContext.Provider value={{ user: { id: 1 }, role: 'admin' }}>
          <UsuarioDetallePage />
        </AuthContext.Provider>
      );
    }).not.toThrow();
  });

  it('muestra los datos del usuario', async () => {
    const { findByText } = render(
      <AuthContext.Provider value={{ user: { id: 1 }, role: 'admin' }}>
        <UsuarioDetallePage userId={1} />
      </AuthContext.Provider>
    );
    expect(await findByText('Test User')).toBeInTheDocument();
    expect(await findByText('Email: test@futpro.com')).toBeInTheDocument();
    expect(await findByText('Rol: admin')).toBeInTheDocument();
  });
});
