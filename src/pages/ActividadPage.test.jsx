jest.mock('../supabaseClient');
import React from 'react';
import { render } from '@testing-library/react';
import ActividadPage from './ActividadPage.jsx';

describe('ActividadPage', () => {
  test('renderiza sin errores', () => {
    const { container } = render(<ActividadPage />);
    expect(container).toBeInTheDocument();
  });
});