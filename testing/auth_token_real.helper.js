if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

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

module.exports = { getToken };
