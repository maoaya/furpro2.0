import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import PartidoDetalle from './PartidoDetalle.jsx';

// Mock de supabaseClient con channel()
jest.mock('../supabaseClient', () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    })),
    channel: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn()
      }))
    })),
    removeChannel: jest.fn()
  }
}));

const mockAuthValue = {
  user: { id: '123', email: 'test@futpro.com' },
  role: 'admin',
  loading: false
};

describe('PartidoDetalle', () => {
  test('renderiza sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthValue}>
          <PartidoDetalle />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });
});