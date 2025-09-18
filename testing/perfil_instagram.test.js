// tests/perfil_instagram.test.js
// Test de ejemplo para perfiles de usuario tipo Instagram


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');

describe('Perfiles tipo Instagram', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe mostrar el perfil de usuario con fotos, seguidores y publicaciones', async () => {
    const res = await request(app)
      .get('/api/user/profile/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('profile');
    expect(Array.isArray(res.body.profile.fotos)).toBe(true);
    expect(Array.isArray(res.body.profile.seguidores)).toBe(true);
    expect(Array.isArray(res.body.profile.publicaciones)).toBe(true);
  });
});
