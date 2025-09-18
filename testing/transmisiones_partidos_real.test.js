// Test real para transmisiones y barra de selección de partidos en vivo
const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Transmisiones y selección de partidos en vivo (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe mostrar la lista de partidos en vivo', async () => {
    const res = await request(app)
      .get('/api/live/matches')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
    expect(Array.isArray(res.body.matches)).toBe(true);
  });

  it('debe seleccionar un partido en vivo', async () => {
    const res = await request(app)
      .post('/api/live/select')
      .set('Authorization', `Bearer ${token}`)
      .send({ matchId: 1 });
  expect([200, 404]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('selected');
  });
});
