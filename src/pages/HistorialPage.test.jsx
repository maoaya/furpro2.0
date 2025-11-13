jest.mock('../supabaseClient');
import React from 'react';
import { render } from '@testing-library/react';
import HistorialPage from './HistorialPage.jsx';

describe('HistorialPage', () => {
  test('renderiza sin errores', () => {
    const { container } = render(<HistorialPage />);
    expect(container).toBeInTheDocument();
  });
});