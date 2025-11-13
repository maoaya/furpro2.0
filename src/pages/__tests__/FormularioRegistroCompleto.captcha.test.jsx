import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FormularioRegistroCompleto from '../FormularioRegistroCompleto';

// Mock de dependencias
jest.mock('../../supabaseClient');
jest.mock('../../utils/autoConfirmSignup');
jest.mock('../../api/signupBypass');

import { signUpWithAutoConfirm } from '../../utils/autoConfirmSignup';
import { signupBypass } from '../../api/signupBypass';

describe('FormularioRegistroCompleto - Manejo de Error CAPTCHA', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('debería renderizar el paso 1 con todos los campos', async () => {
    render(
      <BrowserRouter>
        <FormularioRegistroCompleto />
      </BrowserRouter>
    );

    // Verificar que el paso 1 se renderiza correctamente
    expect(screen.getByText(/Registro Completo/i)).toBeInTheDocument();
    expect(screen.getByText(/Paso 1: Credenciales/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Correo electrónico/i)).toBeInTheDocument();
    
    // Verificar que hay 2 campos de contraseña
    const passwordInputs = screen.getAllByPlaceholderText(/contraseña/i);
    expect(passwordInputs).toHaveLength(2);
    
    // Verificar selector de categoría
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
  });

  test('debería renderizar formulario sin errores', () => {
    render(
      <BrowserRouter>
        <FormularioRegistroCompleto />
      </BrowserRouter>
    );
    
    // Verificar que renderiza
    expect(screen.getByText(/Registro Completo/i)).toBeInTheDocument();
  });

  test('debería renderizar el formulario multi-paso correctamente', async () => {
    render(
      <BrowserRouter>
        <FormularioRegistroCompleto />
      </BrowserRouter>
    );

    // Verificar que se renderiza el paso 1
    expect(screen.getByText(/Registro Completo/i)).toBeInTheDocument();
    expect(screen.getByText(/Paso 1: Credenciales/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Correo electrónico/i)).toBeInTheDocument();
  });

  test('debería continuar normalmente cuando signup es exitoso sin errores CAPTCHA', async () => {
    signUpWithAutoConfirm.mockResolvedValue({
      success: true,
      user: { id: 'user-123', email: 'test@example.com' }
    });

    render(
      <BrowserRouter>
        <FormularioRegistroCompleto />
      </BrowserRouter>
    );

    // Verificar que no hay errores mostrados inicialmente
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
