import React from 'react';
jest.mock('../supabaseClient');
import { render, screen, fireEvent } from '@testing-library/react';
import TransmisionDirectaFutpro from './TransmisionDirectaFutpro';

describe('TransmisionDirectaFutpro', () => {
  test('renderiza el título y el botón inicial', () => {
    render(<TransmisionDirectaFutpro />);
    expect(screen.getByText('Transmisión Directa FutPro')).toBeInTheDocument();
    expect(screen.getByText('Iniciar transmisión')).toBeInTheDocument();
    expect(screen.getByText('No hay transmisión activa.')).toBeInTheDocument();
  });

  test('inicia y finaliza la transmisión', () => {
    render(<TransmisionDirectaFutpro />);
    fireEvent.click(screen.getByText('Iniciar transmisión'));
    expect(screen.getByText('Finalizar transmisión')).toBeInTheDocument();
    expect(screen.getByText('Compartir enlace')).toBeInTheDocument();
    expect(screen.getByText('Transmisión en curso...')).toBeInTheDocument();
    expect(screen.getByText('Enlace de transmisión:')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Finalizar transmisión'));
    expect(screen.getByText('Iniciar transmisión')).toBeInTheDocument();
    expect(screen.getByText('No hay transmisión activa.')).toBeInTheDocument();
  });

  test('compartir enlace muestra alerta', () => {
    window.alert = jest.fn();
    render(<TransmisionDirectaFutpro />);
    fireEvent.click(screen.getByText('Iniciar transmisión'));
    fireEvent.click(screen.getByText('Compartir enlace'));
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Enlace copiado: https://futpro.live/stream/12345'));
  });
});
