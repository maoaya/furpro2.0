// tests/historias.test.js
// Test de ejemplo para publicar y ver historias


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
import { app } from '../server.js';

describe('Historias', () => {
  const token = 'TOKEN_DE_PRUEBA';
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
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.stories)).toBe(true);
  });
});
