import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import LoginRegisterForm from '../LoginRegisterForm.jsx';

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
      })
    }
  }
}));

describe('LoginRegisterForm', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test('login exitoso', async () => {
    await act(async () => {
      render(<LoginRegisterForm />);
    });

    // Click the button to show the email/password form
    fireEvent.click(screen.getByText('Ingresar con Email'));

    fireEvent.change(await screen.findByPlaceholderText('Email'), { target: { value: 'test@futpro.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Ingresar'));
    await waitFor(() => {
      expect(screen.getByText('¡Ingreso exitoso!')).toBeInTheDocument();
    });
  });

  test('registro exitoso', async () => {
    await act(async () => {
      render(<LoginRegisterForm />);
    });
    fireEvent.click(screen.getByText('Ingresar con Email'));
    fireEvent.click(screen.getByText('¿No tienes cuenta?'));
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'nuevo@futpro.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'abcdef' } });
    fireEvent.click(screen.getByText('Registrarse'));
    await waitFor(() => {
      expect(screen.getByText('¡Registro exitoso!')).toBeInTheDocument();
    });
  });

  test('login falla con credenciales inválidas', async () => {
    await act(async () => {
      render(<LoginRegisterForm />);
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
      render(<LoginRegisterForm />);
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
