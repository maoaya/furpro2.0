import React from 'react';
import { render, screen } from '@testing-library/react';
import MarketplacePanel from './MarketplacePanel';
describe('MarketplacePanel', () => {
  test('renderiza el panel de marketplace', () => {
    render(<MarketplacePanel />);
    expect(screen.getByText(/marketplace/i)).toBeInTheDocument();
  });
});
