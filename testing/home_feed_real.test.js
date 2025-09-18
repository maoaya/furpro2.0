global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/home_feed_real.test.js
// Test real para HomePage tipo Instagram (feed, historias, publicaciones)


const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('HomePage tipo Instagram (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe mostrar el feed principal', async () => {
    const res = await request(app.default || app)
      .get('/api/feed')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(Array.isArray(res.body.feed)).toBe(true);
  });

  it('debe mostrar historias en el feed', async () => {
    const res = await request(app.default || app)
      .get('/api/feed/stories')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(Array.isArray(res.body.stories)).toBe(true);
  });
  afterAll(() => {
    jest.setTimeout(5000);
  }, 20000);
});
