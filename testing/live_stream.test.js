// tests/live_stream.test.js
// Test de ejemplo para transmisión en vivo


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');

describe('Transmisión en vivo', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe iniciar una transmisión en vivo', async () => {
    const res = await request(app)
      .post('/api/live/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Transmisión de prueba' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('streamUrl');
  });
});
