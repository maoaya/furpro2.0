// Test real para edición y guardado de datos de usuario y foto de perfil
const request = require('supertest');
const { app } = require('../server');
const path = require('path');
const { getToken } = require('./auth_token_real.helper');

describe('Perfil de usuario (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe editar datos del usuario', async () => {
    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'NuevoNombre', bio: 'Bio actualizada' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('user');
  });

  it('debe subir una foto de perfil', async () => {
    const res = await request(app)
      .post('/api/user/profile/photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', path.join(__dirname, 'fixtures', 'profile.jpg'));
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('photoUrl');
  });

  it('debe cambiar la foto de perfil', async () => {
    const res = await request(app)
      .put('/api/user/profile/photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', path.join(__dirname, 'fixtures', 'profile2.jpg'));
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('photoUrl');
  });
  afterAll(() => {
    jest.setTimeout(5000);
  }, 20000);
});
