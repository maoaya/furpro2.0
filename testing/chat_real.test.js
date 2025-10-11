
// Test real para envío de mensaje usando el endpoint real de tu backend
const request = require('supertest');
import { app } from '../server.js';
const { getToken } = require('./auth_token_real.helper');

describe('Chat (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);
  it('debe enviar un mensaje correctamente', async () => {
    const res = await request(app)
      .post('/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ to: 'usuario2', mensaje: '¡Hola desde test!' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('success', true);
  });
});
