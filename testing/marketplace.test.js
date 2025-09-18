// tests/marketplace.test.js
// Test de ejemplo para marketplace: publicar, comprar, editar productos


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');


describe('Marketplace', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe publicar un producto', async () => {
    const res = await request(app.default || app)
      .post('/api/marketplace/publish')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Balón', precio: 100 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('product');
  });

  it('debe comprar un producto', async () => {
    const res = await request(app.default || app)
      .post('/api/marketplace/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('order');
  });

  it('debe editar un producto', async () => {
    const res = await request(app.default || app)
      .put('/api/marketplace/edit/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ precio: 120 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('product');
  });
});
