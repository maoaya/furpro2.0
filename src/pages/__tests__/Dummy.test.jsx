import React from 'react';
import { render } from '@testing-library/react';

function Dummy() {
  return <div>Hola test</div>;
}

describe('Dummy', () => {
  it('renderiza sin error', () => {
    expect(() => render(<Dummy />)).not.toThrow();
  });
});
