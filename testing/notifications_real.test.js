global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/notifications_real.test.js
// Test real para envío de notificaciones usando el endpoint real de tu backend


const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Notificaciones (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);
  it('debe enviar una notificación correctamente', async () => {
    const res = await request(app.default || app)
      .post('/api/notifications/send')
      .set('Authorization', `Bearer ${token}`)
      .send({ to: 'usuario2', message: 'Notificación de prueba' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('success', true);
  });
  afterAll(() => {
    jest.setTimeout(5000);
  }, 20000);
});
