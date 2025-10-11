global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/moderation_real.test.js
// Test real para reportar contenido usando el endpoint real de tu backend


const request = require('supertest');
import { app } from '../server.js';
const { getToken } = require('./auth_token_real.helper');

describe('Moderación (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);
  it('debe reportar contenido correctamente', async () => {
    const res = await request(app.default || app)
      .post('/api/moderation/report')
      .set('Authorization', `Bearer ${token}`)
      .send({ contentId: 1, reason: 'Contenido inapropiado' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('success', true);
  });
  afterAll(() => {
    jest.setTimeout(5000);
  }, 20000);
});
