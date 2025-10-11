import supertest from 'supertest';
import { app } from '../server.js';

describe('Invitaciones', () => {
	const token = 'TOKEN_DE_PRUEBA';
	it('debe invitar a un usuario a un campeonato', async () => {
		const res = await supertest(app)
			.post('/api/tournaments/invite')
			.set('Authorization', `Bearer ${token}`)
			.send({ userId: 2, tournamentId: 1 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('invitation');
	});

	it('debe invitar a un usuario a un equipo', async () => {
		const res = await supertest(app)
			.post('/api/teams/invite')
			.set('Authorization', `Bearer ${token}`)
			.send({ userId: 2, teamId: 1 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('invitation');
	});

	it('debe aceptar una invitación', async () => {
		const res = await supertest(app)
			.post('/api/invitations/accept')
			.set('Authorization', `Bearer ${token}`)
			.send({ invitationId: 1 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('status', 'accepted');
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
