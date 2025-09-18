const request = require('supertest');
const app = require('../server-test.js');

describe('Health check /api/ping', () => {
  it('responde con status ok y campos esperados', async () => {
    const res = await request(app).get('/api/ping').expect(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBe('pong');
    expect(typeof res.body.timestamp).toBe('string');
    expect(res.body.version).toBeDefined();
  });
});
