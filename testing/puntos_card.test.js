// tests/puntos_card.test.js
// Test de ejemplo para sistema de puntos y cambio de card/ranking


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');

describe('Sistema de puntos y cambio de card/ranking', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe sumar puntos al usuario', async () => {
    const res = await request(app)
      .post('/api/points/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ points: 10 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('points');
  });

  it('debe restar puntos al usuario', async () => {
    const res = await request(app)
      .post('/api/points/subtract')
      .set('Authorization', `Bearer ${token}`)
      .send({ points: 5 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('points');
  });

  it('debe cambiar la card del usuario', async () => {
    const res = await request(app)
      .post('/api/user/card/change')
      .set('Authorization', `Bearer ${token}`)
      .send({ cardId: 2 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('card');
  });

  it('debe actualizar el ranking del usuario', async () => {
    const res = await request(app)
      .post('/api/ranking/update')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('ranking');
  });
});
