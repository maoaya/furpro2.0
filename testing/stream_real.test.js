// Test real para inicio de transmisión en vivo usando el endpoint real de tu backend
const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Streaming (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);
  it('debe iniciar una transmisión en vivo', async () => {
    const res = await request(app)
      .post('/api/live/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Transmisión de prueba' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('streamUrl');
  }, 20000);
});
