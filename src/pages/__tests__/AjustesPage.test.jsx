import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AjustesPage from '../AjustesPage.jsx';

describe('AjustesPage', () => {
  it('simula clicks en todos los botones principales', async () => {
    const { getByText } = render(<AjustesPage />);
    fireEvent.click(getByText('Guardar'));
    fireEvent.click(getByText('Filtrar'));
    fireEvent.click(getByText('Volver'));
  });
});
