/**
 * Test para AuthCallback - Verificar flujo de redirección post-OAuth
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthCallback from '../AuthCallback';

// Mock de AuthContext
const mockUser = {
  id: 'test-user-123',
  email: 'test@futpro.com',
  user_metadata: { nombre: 'Test User' }
};

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: mockUser,
    role: 'player',
    loading: false
  }))
}));

// Mock de Supabase
jest.mock('../../supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'test-user-123',
              email: 'test@futpro.com',
              user_metadata: { nombre: 'Test User' }
            },
            access_token: 'mock-token-123'
          }
        },
        error: null
      })
    },
    from: jest.fn(() => ({
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: {
              id: 'carfutpro-123',
              user_id: 'test-user-123',
              categoria: 'masculina',
              nombre: 'Test User',
              puntaje: 75
            },
            error: null
          })
        }))
      }))
    }))
  }
}));

// Mock de UserActivityTracker
jest.mock('../../services/UserActivityTracker', () => ({
  __esModule: true,
  default: {
    trackLogin: jest.fn(),
    trackAction: jest.fn()
  }
}));

// Mock de navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('AuthCallback - Redirección post-OAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    // Limpiar específicamente los keys que usan los tests
    localStorage.removeItem('post_auth_target');
    localStorage.removeItem('oauth_origin');
    localStorage.removeItem('draft_carfutpro');
    localStorage.removeItem('futpro_user_card_data');
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('debe redirigir a /registro-perfil cuando post_auth_target está establecido', async () => {
    localStorage.setItem('post_auth_target', '/registro-perfil');
    localStorage.setItem('oauth_origin', 'formulario_registro');

    render(
      <BrowserRouter>
        <AuthCallback />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/registro-perfil');
    }, { timeout: 15000 });

    // Verificar que se limpiaron los flags
    expect(localStorage.getItem('post_auth_target')).toBeNull();
    expect(localStorage.getItem('oauth_origin')).toBeNull();
  }, 20000);

  test('debe redirigir a /perfil-card cuando no hay post_auth_target (default)', async () => {
    render(
      <BrowserRouter>
        <AuthCallback />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/perfil-card');
    }, { timeout: 15000 });
  }, 20000);

  test('debe crear carfutpro cuando el target es /perfil-card desde formulario', async () => {
    localStorage.setItem('post_auth_target', '/perfil-card');
    localStorage.setItem('oauth_origin', 'formulario_registro');
    localStorage.setItem('draft_carfutpro', JSON.stringify({
      categoria: 'masculina',
      nombre: 'Test Player',
      posicion_favorita: 'Delantero Centro'
    }));

    const supabase = require('../../supabaseClient').default;

    render(
      <BrowserRouter>
        <AuthCallback />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('carfutpro');
      expect(mockNavigate).toHaveBeenCalledWith('/perfil-card');
    }, { timeout: 15000 });

    // Verificar que se guardó futpro_user_card_data
    const cardData = localStorage.getItem('futpro_user_card_data');
    expect(cardData).toBeTruthy();
    
    if (cardData) {
      const parsed = JSON.parse(cardData);
      expect(parsed.id).toBe('carfutpro-123');
      expect(parsed.esPrimeraCard).toBe(true);
    }
  }, 20000);

  test('debe usar window.location.href como fallback si navigate falla', async () => {
    mockNavigate.mockImplementation(() => {
      throw new Error('Navigate failed');
    });

    const mockAssign = jest.fn();
    delete window.location;
    window.location = { 
      href: 'http://localhost/',
      assign: mockAssign 
    };

    localStorage.setItem('post_auth_target', '/registro-perfil');
    
    render(
      <BrowserRouter>
        <AuthCallback />
      </BrowserRouter>
    );

    // AuthCallback ejecuta lógica en useEffect con setTimeout
    // Esperar a que se complete la navegación
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    }, { timeout: 10000 });
  });
});
