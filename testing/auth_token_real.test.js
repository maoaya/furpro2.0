if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}
// tests/auth_token_real.test.js
// Test base para login y obtención automática de token para otros tests

const request = require('supertest');
const { app, server } = require('../server');

const testUser = {
  email: 'testuser@example.com',
  password: 'Test1234!'
};


async function getToken(srv) {
  const target = srv || app || server;
  const res = await request(target)
    .post('/api/auth/login')
    .send(testUser);
  if (!res.body.token) throw new Error('No se pudo obtener el token');
  return res.body.token;
}

// Test mínimo para evitar fallo de Jest por archivo sin tests.
// No ejecuta lógica de red; solo valida la exportación del helper.
describe('auth_token_real helper', () => {
  test('expone getToken como función', () => {
    expect(typeof getToken).toBe('function');
  });
});

module.exports = { getToken };


