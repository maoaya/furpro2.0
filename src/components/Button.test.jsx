import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renderiza el texto y responde al click', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Haz clic</Button>);
  const btn = screen.getByText('Haz clic');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
