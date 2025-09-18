global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/marketplace_real.test.js
// Test real para marketplace: publicar, comprar, editar productos


const request = require('supertest');
const { server } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Marketplace (real)', () => {
  let token;
  let testServer;
  beforeAll(async () => {
    jest.setTimeout(20000);
    testServer = await new Promise((resolve) => server.listen(0, () => resolve(server)));
    token = await getToken(testServer);
  }, 20000);
  afterAll((done) => {
    if (testServer && testServer.close) testServer.close(done);
    jest.setTimeout(5000);
  }, 20000);

  it('debe publicar un producto', async () => {
    const res = await request(testServer)
      .post('/api/marketplace/publish')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Balón', precio: 100 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('product');
  });

  it('debe comprar un producto', async () => {
    const res = await request(testServer)
      .post('/api/marketplace/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('order');
  });

  it('debe editar un producto', async () => {
    const res = await request(testServer)
      .put('/api/marketplace/edit/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ precio: 120 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('product');
  });
});
