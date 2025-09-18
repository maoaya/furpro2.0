// tests/foto_perfil.test.js
// Test de ejemplo para subida y cambio de foto de perfil


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');
const path = require('path');

describe('Foto de perfil', () => {
  const token = 'TOKEN_DE_PRUEBA';
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
      .attach('file', path.join(__dirname, 'fixtures', 'profile2.jpg')); // Ensure this file exists
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('photoUrl');
  });
});
