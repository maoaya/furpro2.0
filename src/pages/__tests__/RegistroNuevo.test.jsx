import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegistroNuevo from '../RegistroNuevo.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('RegistroNuevo', () => {
  test('renderiza el formulario de registro', () => {
    render(
      <MemoryRouter>
        <RegistroNuevo />
      </MemoryRouter>
    );
    expect(screen.getByText(/crea tu cuenta/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
  });

  test('permite ingresar datos y enviar el formulario', () => {
    render(
      <MemoryRouter>
        <RegistroNuevo />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText(/correo/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);
    const submitBtn = screen.getByRole('button', { name: /crear cuenta/i });

    fireEvent.change(emailInput, { target: { value: 'juan@futpro.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(submitBtn);

    // Validar que el botón cambia a "Procesando..." y está deshabilitado
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent(/procesando/i);
  });
});
