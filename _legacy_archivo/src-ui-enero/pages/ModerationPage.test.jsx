import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModerationPage from './ModerationPage.jsx';

describe('ModerationPage', () => {
  test('renderiza sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <ModerationPage />
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });
});