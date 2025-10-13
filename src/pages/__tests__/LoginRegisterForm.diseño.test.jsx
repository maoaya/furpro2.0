import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginRegisterForm from '../LoginRegisterForm.jsx';

describe('LoginRegisterForm diseño de botones', () => {
  it('muestra el botón de Google', () => {
    render(<LoginRegisterForm />);
    expect(screen.getByTestId('btn-google')).toBeInTheDocument();
  });
  it('muestra el botón de Facebook', () => {
    render(<LoginRegisterForm />);
    expect(screen.getByTestId('btn-facebook')).toBeInTheDocument();
  });
  it('muestra el botón de email', () => {
    render(<LoginRegisterForm />);
    expect(screen.getByTestId('btn-email-form')).toBeInTheDocument();
  });
  it('muestra el botón de registro completo', () => {
    render(<LoginRegisterForm />);
    expect(screen.getByTestId('btn-registro-completo')).toBeInTheDocument();
  });
  it('muestra el botón de crear usuario de emergencia', () => {
    render(<LoginRegisterForm />);
    expect(screen.getByTestId('btn-crear-usuario-backup')).toBeInTheDocument();
  });
});
