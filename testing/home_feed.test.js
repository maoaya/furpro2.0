// tests/home_feed.test.js
// Test de ejemplo para HomePage tipo Instagram (feed, historias, publicaciones)


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
import { app } from '../server.js';

describe('HomePage tipo Instagram', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe mostrar el feed principal', async () => {
    const res = await request(app)
      .get('/api/feed')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.feed)).toBe(true);
  });

  it('debe mostrar historias en el feed', async () => {
    const res = await request(app)
      .get('/api/feed/stories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.stories)).toBe(true);
  });
});
