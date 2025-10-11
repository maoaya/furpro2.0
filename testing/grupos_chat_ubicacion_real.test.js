
// Test real para grupos de chat y ubicación
const request = require('supertest');
import { app } from '../server.js';
const { getToken } = require('./auth_token_real.helper');

describe('Grupos de chat y ubicación (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe crear un grupo de chat', async () => {
    const res = await request(app)
      .post('/api/chat/groups/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Grupo de prueba' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('group');
  });

  it('debe establecer ubicación de usuario', async () => {
    const res = await request(app)
      .post('/api/user/location')
      .set('Authorization', `Bearer ${token}`)
      .send({ lat: 10.123, lng: -74.123 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('location');
  });
});
