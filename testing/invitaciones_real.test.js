global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
// tests/invitaciones_real.test.js
// Test real para invitaciones a campeonato y equipo


const request = require('supertest');
const { app } = require('../server');
const { getToken } = require('./auth_token_real.helper');

describe('Invitaciones (real)', () => {
  let token;
  beforeAll(async () => {
    jest.setTimeout(20000);
    token = await getToken();
  }, 20000);

  it('debe invitar a un usuario a un campeonato', async () => {
    const res = await request(app.default || app)
      .post('/api/tournaments/invite')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 2, tournamentId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('invitation');
  });

  it('debe invitar a un usuario a un equipo', async () => {
    const res = await request(app.default || app)
      .post('/api/teams/invite')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 2, teamId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('invitation');
  });

  it('debe aceptar una invitación', async () => {
    const res = await request(app.default || app)
      .post('/api/invitations/accept')
      .set('Authorization', `Bearer ${token}`)
      .send({ invitationId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('status', 'accepted');
  });
  afterAll(() => {
    jest.setTimeout(5000);
  }, 20000);
});
