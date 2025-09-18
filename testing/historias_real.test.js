
// Test real para publicar y ver historias
const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Historias (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe publicar una historia', async () => {
    const res = await request(app)
      .post('/api/stories/publish')
      .set('Authorization', `Bearer ${token}`)
      .send({ mediaUrl: 'https://test.com/story.jpg', texto: 'Historia de prueba' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('story');
  });

  it('debe ver historias', async () => {
    const res = await request(app)
      .get('/api/stories')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 201]).toContain(res.statusCode);
    expect(Array.isArray(res.body.stories)).toBe(true);
  });
});
