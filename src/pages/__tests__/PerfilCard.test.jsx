// Simplified PerfilCard test to avoid jsdom location issues
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1' } })
}));

import PerfilCard from '../PerfilCard';

test('PerfilCard muestra datos básicos de la card', () => {
  const mockCardData = {
    id: 'c1',
    categoria: 'Élite',
    nombre: 'Jugador Test',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    posicion_favorita: 'Delantero',
    nivel_habilidad: 'Avanzado',
    puntaje: 90,
    equipo: 'FC FutPro',
    fecha_registro: new Date().toISOString(),
    esPrimeraCard: true
  };
  
  localStorage.setItem('futpro_user_card_data', JSON.stringify(mockCardData));
  
  render(
    <BrowserRouter>
      <PerfilCard />
    </BrowserRouter>
  );
  
  expect(screen.getByText(/Jugador Test/i)).toBeInTheDocument();
});
