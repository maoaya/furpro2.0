// tests/grupos_chat_ubicacion.test.js
// Test de ejemplo para grupos de chat y ubicación


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');

describe('Grupos de chat y ubicación', () => {
  const token = 'TOKEN_DE_PRUEBA';
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
