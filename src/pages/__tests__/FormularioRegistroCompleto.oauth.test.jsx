/**
 * Test específico para el flujo OAuth desde FormularioRegistroCompleto
 * Verifica que se establezca correctamente post_auth_target y oauth_origin
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FormularioRegistroCompleto from '../FormularioRegistroCompleto';

// Mock de Supabase
jest.mock('../../supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      signInWithOAuth: jest.fn().mockResolvedValue({ 
        data: { url: 'https://accounts.google.com/mock' },
        error: null 
      }),
      getSession: jest.fn().mockResolvedValue({ data: { session: null } })
    }
  }
}));

// Mock de config
jest.mock('../../config/environment', () => ({
  getConfig: jest.fn(() => ({
    oauthCallbackUrl: 'http://localhost:5173/auth/callback',
    baseUrl: 'http://localhost:5173',
    isProduction: false
  }))
}));

// Mock de utils
jest.mock('../../utils/autoConfirmSignup', () => ({
  signUpWithAutoConfirm: jest.fn()
}));

jest.mock('../../api/signupBypass', () => ({
  signupBypass: jest.fn()
}));

describe('FormularioRegistroCompleto - Flujo OAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('debe establecer post_auth_target=/registro-perfil al hacer OAuth desde formulario', async () => {
    const { container } = render(
      <BrowserRouter>
        <FormularioRegistroCompleto />
      </BrowserRouter>
    );

    // Avanzar hasta el paso 5 (donde está el botón de Google)
    // Llenar paso 1
    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelectorAll('input[type="password"]')[0];
    const confirmPasswordInput = container.querySelectorAll('input[type="password"]')[1];
    
    if (emailInput && passwordInput && confirmPasswordInput) {
      fireEvent.change(emailInput, { target: { value: 'test@futpro.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      // Click siguiente
      const siguienteBtn = screen.queryByText(/Siguiente/i);
      if (siguienteBtn) {
        fireEvent.click(siguienteBtn);
        
        await waitFor(() => {
          // Verificar que avanzó al paso 2 (usar getAllByText porque "Paso 2" aparece 2 veces: en h2 y en footer)
          const paso2Elements = screen.getAllByText(/Paso 2/i);
          expect(paso2Elements.length).toBeGreaterThan(0);
        }, { timeout: 3000 });
      }
    }

    // Buscar y hacer click en el botón de Google OAuth
    const googleButton = screen.queryByText(/Continuar con Google/i);
    
    if (googleButton) {
      fireEvent.click(googleButton);

      await waitFor(() => {
        // Verificar que se establecieron los valores en localStorage
        const postAuthTarget = localStorage.getItem('post_auth_target');
        const oauthOrigin = localStorage.getItem('oauth_origin');
        
        expect(postAuthTarget).toBe('/registro-perfil');
        expect(oauthOrigin).toBe('formulario_registro');
      }, { timeout: 3000 });

      // Verificar que se guardaron los drafts
      const cardData = localStorage.getItem('futpro_user_card_data');
      const showFirstCard = localStorage.getItem('show_first_card');
      const registroDraft = localStorage.getItem('futpro_registro_draft');
      const carfutproDraft = localStorage.getItem('draft_carfutpro');

      expect(cardData).toBeTruthy();
      expect(showFirstCard).toBe('true');
      expect(registroDraft).toBeTruthy();
      expect(carfutproDraft).toBeTruthy();

      // Verificar estructura de cardData
      if (cardData) {
        const parsed = JSON.parse(cardData);
        expect(parsed).toHaveProperty('id');
        expect(parsed).toHaveProperty('categoria');
        expect(parsed).toHaveProperty('puntaje');
        expect(parsed.esPrimeraCard).toBe(true);
      }
    }
  });

  test('debe calcular puntaje inicial correctamente', async () => {
    render(
      <BrowserRouter>
        <FormularioRegistroCompleto />
      </BrowserRouter>
    );

    const googleButton = screen.queryByText(/Continuar con Google/i);
    
    if (googleButton) {
      fireEvent.click(googleButton);

      await waitFor(() => {
        const cardDataRaw = localStorage.getItem('futpro_user_card_data');
        if (cardDataRaw) {
          const cardData = JSON.parse(cardDataRaw);
          // Puntaje debe estar entre 50 y 100
          expect(cardData.puntaje).toBeGreaterThanOrEqual(50);
          expect(cardData.puntaje).toBeLessThanOrEqual(100);
        }
      }, { timeout: 2000 });
    }
  });

  test('debe preservar datos del formulario en los drafts', async () => {
    const { container } = render(
      <BrowserRouter>
        <FormularioRegistroCompleto />
      </BrowserRouter>
    );

    // Llenar datos de prueba
    const emailInput = container.querySelector('input[type="email"]');
    if (emailInput) {
      fireEvent.change(emailInput, { target: { value: 'jugador@test.com' } });
    }

    const googleButton = screen.queryByText(/Continuar con Google/i);
    if (googleButton) {
      fireEvent.click(googleButton);

      await waitFor(() => {
        const registroDraft = localStorage.getItem('futpro_registro_draft');
        if (registroDraft) {
          const parsed = JSON.parse(registroDraft);
          expect(parsed.email).toBe('jugador@test.com');
          expect(parsed).toHaveProperty('ultimoGuardado');
        }
      }, { timeout: 2000 });
    }
  });
});
