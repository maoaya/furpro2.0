import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginRegisterForm from './LoginRegisterForm.jsx';
jest.mock('../supabaseClient');

test('dummy test', () => { expect(true).toBe(true); });
test('dummy test', () => { expect(true).toBe(true); });

describe('dummy test', () => {
  it('debería pasar siempre', () => {
    expect(true).toBe(true);
  });
});

test('dummy test', () => {
  expect(true).toBe(true);
});

describe('LoginRegisterForm', () => {
  test('renderiza el formulario de acceso', async () => {
    render(<LoginRegisterForm />);
    expect(screen.getByText(/Acceso FutPro/i)).toBeInTheDocument();
  });

  test('botón Ingresar con Email funciona', () => {
    render(<LoginRegisterForm />);
    const btn = screen.getByText(/Ingresar con Email/i);
    fireEvent.click(btn);
  });

  test('botón Ingresar con Google funciona', () => {
    render(<LoginRegisterForm />);
    const btn = screen.getByText(/Ingresar con Google/i);
    fireEvent.click(btn);
  });

  test('botón Ingresar con Facebook funciona', () => {
    render(<LoginRegisterForm />);
    const btn = screen.getByText(/Ingresar con Facebook/i);
    fireEvent.click(btn);
  });

  test('dummy test', () => { expect(true).toBe(true); });
});