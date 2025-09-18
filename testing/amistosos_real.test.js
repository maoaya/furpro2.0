
// Test real para crear y aceptar amistosos
const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Amistosos (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe crear un amistoso', async () => {
    const res = await request(app)
      .post('/api/friendlies/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ equipo1: 1, equipo2: 2, fecha: '2025-09-10' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('friendly');
  });

  it('debe aceptar un amistoso', async () => {
    const res = await request(app)
      .post('/api/friendlies/accept')
      .set('Authorization', `Bearer ${token}`)
      .send({ friendlyId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('status', 'accepted');
  });
});
