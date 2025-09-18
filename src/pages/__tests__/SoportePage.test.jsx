import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SoportePage from '../SoportePage.jsx';

describe('SoportePage', () => {
  it('simula clicks en todos los botones principales', async () => {
    const { getByText } = render(<SoportePage />);
    fireEvent.click(getByText('Consultar'));
    fireEvent.click(getByText('Filtrar'));
    fireEvent.click(getByText('Volver'));
  });
});
