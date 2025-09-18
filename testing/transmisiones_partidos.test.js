// Test de ejemplo para transmisiones y barra de selección de partidos en vivo
const request = require('supertest');
const { app } = require('../server');

describe('Transmisiones y selección de partidos en vivo', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe mostrar la lista de partidos en vivo', async () => {
    const res = await request(app)
      .get('/api/live/matches')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.matches)).toBe(true);
  });

  it('debe seleccionar un partido en vivo', async () => {
    const res = await request(app)
      .post('/api/live/select')
      .set('Authorization', `Bearer ${token}`)
      .send({ matchId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('selected');
  });
});
