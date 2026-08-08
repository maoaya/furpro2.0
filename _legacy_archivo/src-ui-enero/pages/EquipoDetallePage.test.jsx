import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EquipoDetallePage from './EquipoDetallePage.jsx';

// Mock de supabaseClient con channel()
jest.mock('../supabaseClient', () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
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

describe('EquipoDetallePage', () => {
  test('renderiza sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <EquipoDetallePage />
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });
});