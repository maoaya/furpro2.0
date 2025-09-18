// Test de ejemplo para horarios de partidos según campeonato


if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');

describe('Horarios de partidos', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe mostrar los horarios de partidos de un campeonato', async () => {
    const res = await request(app)
      .get('/api/tournaments/1/schedule')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.schedule)).toBe(true);
  });
});
