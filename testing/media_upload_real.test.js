global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/media_upload_real.test.js
// Test real para subida de fotos usando el endpoint real de tu backend


const request = require('supertest');
const { app } = require('../server');
const path = require('path');
const { getToken } = require('./auth_token_real.helper');

describe('Subida de fotos (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe subir una foto correctamente', async () => {
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', path.join(__dirname, 'fixtures', 'test.jpg'));
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('url');
  });
});
