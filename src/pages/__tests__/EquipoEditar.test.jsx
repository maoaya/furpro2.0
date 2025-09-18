import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EquipoEditar from '../EquipoEditar.jsx';

describe('EquipoEditar', () => {
  it('simula interacción con todos los botones y formulario', async () => {
  const { getByLabelText, findByText, findAllByText } = render(<EquipoEditar />);
  fireEvent.change(getByLabelText('Nombre:'), { target: { value: 'FutPro FC', name: 'nombre' } });
  fireEvent.change(getByLabelText('Categoría:'), { target: { value: 'A', name: 'categoria' } });
  fireEvent.change(getByLabelText('Miembros:'), { target: { value: 11, name: 'miembros' } });
  const guardarButtons = await findAllByText('Guardar');
  // Click en el botón submit del formulario
  fireEvent.click(guardarButtons.find(btn => btn.type === 'submit'));
  // Click en el botón Guardar secundario
  fireEvent.click(guardarButtons.find(btn => btn.type === 'button'));
  fireEvent.click(await findByText('Filtrar'));
  fireEvent.click(await findByText('Volver'));
    expect(await findByText('Editar Equipo')).toBeInTheDocument();
    expect(await findByText('Gráfico de actividad de edición')).toBeInTheDocument();
  }, 30000);
});
