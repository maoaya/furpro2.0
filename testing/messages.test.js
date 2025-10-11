// tests/messages.test.js
// Test de ejemplo para envío y recepción de mensajes


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
import { app } from '../server.js';

describe('Mensajes (chat individual y grupal)', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe enviar un mensaje a un usuario', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .set('Authorization', `Bearer ${token}`)
      .send({ to: 'usuario2', mensaje: '¡Hola!' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('message');
  });

  it('debe recibir mensajes de un grupo', async () => {
    const res = await request(app)
      .get('/api/messages/group/123')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.messages)).toBe(true);
  });
});
