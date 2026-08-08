import React from 'react';
import { render, screen } from '@testing-library/react';

export default function MarketplacePanel({ productos }) {
  return (
    <div className="marketplace-panel bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border-2 border-yellow-400/30 my-8 animate-fadeInUp">
      <h3 className="text-xl font-bold text-yellow-400 mb-6">Marketplace</h3>
      <ul className="space-y-4">
        {productos?.length ? productos.map((p, idx) => (
          <li key={idx} className="flex justify-between items-center p-4 rounded-lg bg-yellow-50/60 dark:bg-yellow-900/10 border border-yellow-200/30">
            <span className="font-semibold text-yellow-700 dark:text-yellow-300">{p.nombre}</span>
            <span className="text-zinc-900 dark:text-yellow-200 font-bold">{p.precio} €</span>
          </li>
        )) : <li className="text-zinc-500">No hay productos disponibles.</li>}
      </ul>
    </div>
  );
}

describe('MarketplacePanel', () => {
  it('renderiza productos y panel', () => {
    render(<MarketplacePanel productos={[{nombre:'Producto 1',precio:10},{nombre:'Producto 2',precio:20}]} />);
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
  });
});
