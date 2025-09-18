// tests/media_upload.test.js
// Test de ejemplo para subida de fotos y videos usando supertest


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');
const path = require('path');

describe('Subida de fotos y videos', () => {
  it('debe subir una foto correctamente', async () => {
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', 'Bearer test-token')
      .attach('media', path.join(__dirname, 'fixtures', 'test.jpg'));
    expect([200,201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('url');
  });

  it('debe subir un video correctamente', async () => {
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', 'Bearer test-token')
      .attach('media', path.join(__dirname, 'fixtures', 'test.mp4'));
    expect([200,201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('url');
  });
});
