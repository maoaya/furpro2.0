import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaDetailPage from './MediaDetailPage';
describe('MediaDetailPage', () => {
  test('renderiza el mensaje de detalles', () => {
    render(<MediaDetailPage />);
    expect(screen.getByText(/detalles de fotos y videos/i)).toBeInTheDocument();
  });
});
