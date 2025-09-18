global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/horarios_partidos_real.test.js
// Test real para horarios de partidos según campeonato


const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Horarios de partidos (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe mostrar los horarios de partidos de un campeonato', async () => {
    const res = await request(app.default || app)
      .get('/api/tournaments/1/schedule')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(Array.isArray(res.body.schedule)).toBe(true);
  });
  afterAll(() => {
    jest.setTimeout(5000);
  }, 20000);
});
