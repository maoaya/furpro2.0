import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';
let app;
let getToken;

describe('Amistosos (real)', () => {
	let token;
	beforeAll(async () => {
		({ app } = await getServerAndApp());
		({ getToken } = await import('./auth_token_real.helper.mjs'));
		token = await getToken();
	}, 60000); // Aumentar timeout a 60 segundos

	it('debe crear un amistoso', async () => {
		const res = await supertest(app)
			.post('/api/friendlies/create')
			.set('Authorization', `Bearer ${token}`)
			.send({ equipo1: 1, equipo2: 2, fecha: '2025-09-10' });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('friendly');
	}, 30000); // Timeout de 30 segundos para este test

	it('debe aceptar un amistoso', async () => {
		const res = await supertest(app)
			.post('/api/friendlies/accept')
			.set('Authorization', `Bearer ${token}`)
			.send({ friendlyId: 1 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('status', 'accepted');
	}, 30000); // Timeout de 30 segundos para este test
});
