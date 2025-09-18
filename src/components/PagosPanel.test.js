import React from 'react';
import { render, screen } from '@testing-library/react';
import PagosPanel from './PagosPanel';

describe('PagosPanel', () => {
		it('renderiza pagos y panel', () => {
			render(<PagosPanel pagos={[{id:1,usuario:'Juan',monto:100,fecha:'2025-08-01',descripcion:'Membresía Premium'}]} />);
			expect(screen.getByText((content) => content.includes('Pagos y Membresía Premium'))).toBeInTheDocument();
			// Busca todos los elementos con el texto y filtra por <span>
			const spans = screen.getAllByText((content) => content.includes('Membresía Premium'));
			expect(spans.some(el => el.tagName === 'SPAN')).toBe(true);
			expect(screen.getByText((content) => content.includes('Juan'))).toBeInTheDocument();
		});
});
// ...existing code...
