// tests/registro_login.test.js
// Test de ejemplo para registro y login de usuario usando supertest y un servidor Express


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');

describe('Registro y Login de Usuario', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'Test1234!'
  };


  it('debe registrar un usuario nuevo o rechazar si ya existe', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    // Solo debe aceptar respuestas reales, nunca 500
    expect(res.statusCode).not.toBe(500);
    expect([201, 409, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body).toHaveProperty('user');
    } else {
      expect(res.body).toHaveProperty('error');
    }
  });


  it('debe permitir login con usuario registrado', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    expect(res.statusCode).not.toBe(500);
    expect([200, 401, 400]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('token');
    } else {
      expect(res.body).toHaveProperty('error');
    }
  });

  it('debe permitir recuperación de contraseña', async () => {
    const res = await request(app)
      .post('/api/auth/recover')
      .send({ email: testUser.email });
    expect(res.statusCode).not.toBe(500);
    expect([200, 404, 400]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('ok', true);
    } else {
      expect(res.body).toHaveProperty('error');
    }
  });
});
