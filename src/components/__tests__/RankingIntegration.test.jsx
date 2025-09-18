import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import RankingJugadores from '../RankingJugadores.jsx';
import RankingCampeonatos from '../RankingCampeonatos.jsx';

// Importar el Express app del servidor de pruebas y arrancarlo en un puerto aleatorio
// Usamos require para interoperar con el módulo CommonJS de server-test.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../../../server-test.js');

let server;
let baseUrl;

beforeAll((done) => {
  server = app.listen(0, () => {
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}/api`;
    // Los componentes leen API_URL desde process.env o window
    process.env.API_URL = baseUrl;
    // fallback para navegadores/jsdom
    // @ts-ignore
    if (typeof window !== 'undefined') window.__API_URL__ = baseUrl;

    done();
  });
});

afterAll((done) => {
  cleanup();
  if (server) server.close(() => done());
});

afterEach(() => {
  cleanup();
});

describe('Integración FE-BE: Ranking con backend real', () => {
  test('RankingJugadores consulta al backend y muestra datos', async () => {
    render(<RankingJugadores />);

    // Espera a que aparezca un jugador específico
    expect(await screen.findByText(/Juan Pérez/i)).toBeInTheDocument();
    // Verifica que la tabla se renderiza
    expect(screen.getByText(/Ranking de Jugadores/i)).toBeInTheDocument();
  });

  test('RankingCampeonatos consulta al backend y muestra datos', async () => {
    render(<RankingCampeonatos />);

    expect(await screen.findByText(/Liga Profesional 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Ranking de Campeonatos/i)).toBeInTheDocument();
  });
});
