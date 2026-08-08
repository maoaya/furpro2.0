import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaUploadPage from './MediaUploadPage';
describe('MediaUploadPage', () => {
  test('renderiza el título y botón de subir video', () => {
    render(<MediaUploadPage />);
    expect(screen.getByText(/Subir Foto\/Video/i)).toBeInTheDocument();
    expect(screen.getByText(/Subir Video/i)).toBeInTheDocument();
  });
});
