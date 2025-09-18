global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/perfil_instagram_real.test.js
// Test real para perfiles de usuario tipo Instagram


const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Perfiles tipo Instagram (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe mostrar el perfil de usuario con fotos, seguidores y publicaciones', async () => {
    const res = await request(app.default || app)
      .get('/api/user/profile/1')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('profile');
    expect(Array.isArray(res.body.profile.fotos)).toBe(true);
    expect(Array.isArray(res.body.profile.seguidores)).toBe(true);
    expect(Array.isArray(res.body.profile.publicaciones)).toBe(true);
  });
  afterAll(() => {
    jest.setTimeout(5000);
  }, 20000);
});
