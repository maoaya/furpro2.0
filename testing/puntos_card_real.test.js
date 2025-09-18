global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/puntos_card_real.test.js
// Test real para sistema de puntos y cambio de card/ranking


const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Sistema de puntos y cambio de card/ranking (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe sumar puntos al usuario', async () => {
    const res = await request(app.default || app)
      .post('/api/points/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ points: 10 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('points');
  });

  it('debe restar puntos al usuario', async () => {
    const res = await request(app.default || app)
      .post('/api/points/subtract')
      .set('Authorization', `Bearer ${token}`)
      .send({ points: 5 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('points');
  });

  it('debe cambiar la card del usuario', async () => {
    const res = await request(app.default || app)
      .post('/api/user/card/change')
      .set('Authorization', `Bearer ${token}`)
      .send({ cardId: 2 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('card');
  });

  it('debe actualizar el ranking del usuario', async () => {
    const res = await request(app.default || app)
      .post('/api/ranking/update')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('ranking');
  });
  afterAll(() => {
    jest.setTimeout(5000);
  }, 20000);
});
