import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';
let app;
let getToken;

describe('Invitaciones (real)', () => {
	let token;
	beforeAll(async () => {
		({ app } = await getServerAndApp());
		({ getToken } = await import('./auth_token_real.helper.mjs'));
		token = await getToken();
	}, 20000);

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
	afterAll(() => {
		// No es necesario setTimeout aquí
	}, 20000);
});
// ...existing code...
// Este archivo fue convertido a ES Module
