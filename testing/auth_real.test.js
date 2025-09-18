global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/auth_real.test.js
// Test real para registro, login y recuperación de contraseña

const request = require('supertest');
describe('Auth (real)', () => {
const { server } = require('../server');
describe('Auth (real)', () => {
  const testUser = {
// Removed duplicate describe block
    password: 'Test1234!'
  };
  let testServer;
  beforeAll(async () => {
    jest.setTimeout(20000);
    testServer = await new Promise((resolve) => server.listen(0, () => resolve(server)));
  }, 20000);
  afterAll((done) => {
    if (testServer && testServer.close) testServer.close(done);
    jest.setTimeout(5000);
  }, 20000);

  it('debe registrar un usuario nuevo', async () => {
    jest.setTimeout(20000);
    const res = await request(testServer)
      .post('/api/auth/register')
      .send(testUser);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('user');
  }, 20000);

  it('debe permitir login con usuario registrado', async () => {
    jest.setTimeout(20000);
    const res = await request(testServer)
      .post('/api/auth/login')
      .send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  }, 20000);

   it('debe permitir recuperación de contraseña', async () => {
     jest.setTimeout(20000);
     const res = await request(testServer)
       .post('/api/auth/recover')
       .send({ email: testUser.email });
     expect([200, 201]).toContain(res.statusCode);
   }, 20000);
});

});


