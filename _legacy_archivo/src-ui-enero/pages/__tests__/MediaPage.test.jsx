import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MediaPage from '../MediaPage.jsx';

describe('MediaPage', () => {
  it('simula clicks en todos los botones principales', async () => {
    const { getByText } = render(<MediaPage />);
    fireEvent.click(getByText('Subir media'));
    fireEvent.click(getByText('Ver reportes'));
  });
});
