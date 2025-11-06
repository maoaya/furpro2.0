import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import SeleccionCategoria from '../SeleccionCategoria';

// Mock de react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null, search: '' })
}));

describe('SeleccionCategoria - Flujo de Navegación', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
    // Mock window.location.href para fallback
    delete window.location;
    window.location = { href: '' };
  });

  test('debería renderizar el componente con todas las categorías', () => {
    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    expect(screen.getByText(/Selecciona tu categoría/i)).toBeInTheDocument();
    expect(screen.getByText(/Infantil Femenina/i)).toBeInTheDocument();
    expect(screen.getByText(/Infantil Masculina/i)).toBeInTheDocument();
    expect(screen.getByText(/Femenina/i)).toBeInTheDocument();
    expect(screen.getByText(/Masculina/i)).toBeInTheDocument();
  });

  test('debería mostrar botón deshabilitado si no hay categoría seleccionada', () => {
    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    const confirmButton = screen.getByRole('button', { name: /Selecciona una categoría/i });
    expect(confirmButton).toBeDisabled();
  });

  test('debería habilitar botón al seleccionar una categoría', () => {
    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    const categoriaButton = screen.getByRole('button', { name: /Femenina/i });
    fireEvent.click(categoriaButton);

    const confirmButton = screen.getByRole('button', { name: /Crear usuario con categoría seleccionada/i });
    expect(confirmButton).not.toBeDisabled();
  });

  test('debería guardar categoría en localStorage al seleccionar', () => {
    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    const categoriaButton = screen.getByRole('button', { name: /Masculina/i });
    fireEvent.click(categoriaButton);

    const confirmButton = screen.getByRole('button', { name: /Crear usuario con categoría seleccionada/i });
    fireEvent.click(confirmButton);

    const stored = localStorage.getItem('draft_carfutpro');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored);
    expect(parsed.categoria).toBe('masculina');
  });

  test('debería navegar a formulario-registro con categoría en query param', async () => {
    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    // Seleccionar categoría
    const categoriaButton = screen.getByRole('button', { name: /Infantil Femenina/i });
    fireEvent.click(categoriaButton);

    // Confirmar
    const confirmButton = screen.getByRole('button', { name: /Crear usuario con categoría seleccionada/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/formulario-registro?categoria=infantil_femenina',
        { state: { categoria: 'infantil_femenina' } }
      );
    });
  });

  test('debería usar fallback window.location.href si navigate falla', async () => {
    // Forzar error en navigate
    mockNavigate.mockImplementation(() => {
      throw new Error('Navigate failed');
    });

    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    const categoriaButton = screen.getByRole('button', { name: /Femenina/i });
    fireEvent.click(categoriaButton);

    const confirmButton = screen.getByRole('button', { name: /Crear usuario con categoría seleccionada/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(window.location.href).toBe('/formulario-registro?categoria=femenina');
    });
  });

  test('debería aplicar estilos activos a la categoría seleccionada', () => {
    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    const categoriaButton = screen.getByRole('button', { name: /Masculina/i });
    fireEvent.click(categoriaButton);

    // Verificar que el botón tiene estilos de "activo"
    expect(categoriaButton).toHaveStyle({
      background: expect.stringContaining('linear-gradient')
    });
  });

  test('debería detectar categoría desde query params al montar', () => {
    // Mock useLocation para simular query param
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: null,
      search: '?categoria=femenina'
    });

    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    // El botón de confirmación debería estar habilitado
    const confirmButton = screen.getByRole('button', { name: /Crear usuario con categoría seleccionada/i });
    expect(confirmButton).not.toBeDisabled();
  });

  test('debería detectar categoría desde location.state al montar', () => {
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: { categoria: 'infantil_masculina' },
      search: ''
    });

    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    const confirmButton = screen.getByRole('button', { name: /Crear usuario con categoría seleccionada/i });
    expect(confirmButton).not.toBeDisabled();
  });

  test('debería permitir volver atrás usando el botón de retroceso', () => {
    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    const backButton = screen.getByRole('button', { name: /Volver/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('debería manejar múltiples cambios de selección correctamente', () => {
    render(
      <BrowserRouter>
        <SeleccionCategoria />
      </BrowserRouter>
    );

    // Seleccionar primera categoría
    const fem = screen.getByRole('button', { name: /Femenina/i });
    fireEvent.click(fem);

    // Cambiar a segunda categoría
    const masc = screen.getByRole('button', { name: /Masculina/i });
    fireEvent.click(masc);

    // Confirmar
    const confirmButton = screen.getByRole('button', { name: /Crear usuario con categoría seleccionada/i });
    fireEvent.click(confirmButton);

    // Verificar que se usó la última selección
    expect(mockNavigate).toHaveBeenCalledWith(
      '/formulario-registro?categoria=masculina',
      { state: { categoria: 'masculina' } }
    );
  });
});
