// tests/invitaciones.test.js
// Test de ejemplo para invitaciones a campeonato y equipo


global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return { Server: jest.fn(() => ({ on: jest.fn(), emit: jest.fn(), close: jest.fn() })) };
});
const request = require('supertest');
const { app } = require('../server');

describe('Invitaciones', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe invitar a un usuario a un campeonato', async () => {
    const res = await request(app)
      .post('/api/tournaments/invite')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 2, tournamentId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('invitation');
  });

  it('debe invitar a un usuario a un equipo', async () => {
    const res = await request(app)
      .post('/api/teams/invite')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 2, teamId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('invitation');
  });

  it('debe aceptar una invitación', async () => {
    const res = await request(app)
      .post('/api/invitations/accept')
      .set('Authorization', `Bearer ${token}`)
      .send({ invitationId: 1 });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('status', 'accepted');
  });
});
