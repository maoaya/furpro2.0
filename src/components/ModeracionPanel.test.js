import React from 'react';
import { render, screen } from '@testing-library/react';
import ModeracionPanel from './ModeracionPanel';

describe('ModeracionPanel', () => {
	it('renderiza reportes y panel', () => {
		render(<ModeracionPanel reportes={[{id:1,motivo:'Spam',usuario:'Pedro',fecha:'2025-08-20'}]} />);
		expect(screen.getByText((content) => content.includes('Moderación y Reportes'))).toBeInTheDocument();
		expect(screen.getByText((content) => content.includes('Spam'))).toBeInTheDocument();
		expect(screen.getByText((content) => content.includes('Pedro'))).toBeInTheDocument();
	});
});
// ...existing code...
