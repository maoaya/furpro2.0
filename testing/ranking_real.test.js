global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/ranking_real.test.js
// Test real para ranking general, por género y edades


const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Ranking (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe mostrar el ranking general', async () => {
    const res = await request(app.default || app)
      .get('/api/ranking/general')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(Array.isArray(res.body.ranking)).toBe(true);
  });

  it('debe mostrar el ranking por género', async () => {
    const res = await request(app.default || app)
      .get('/api/ranking/gender?gender=masculino')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(Array.isArray(res.body.ranking)).toBe(true);
  });

  it('debe mostrar el ranking por edades', async () => {
    const res = await request(app.default || app)
      .get('/api/ranking/age?range=infantil')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(Array.isArray(res.body.ranking)).toBe(true);
  });
});
