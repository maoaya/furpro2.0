import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';
let app;
let getToken;

describe('Horarios de partidos (real)', () => {
	let token;
	beforeAll(async () => {
		({ app } = await getServerAndApp());
		({ getToken } = await import('./auth_token_real.helper.mjs'));
		token = await getToken();
	}, 20000);

	it('debe mostrar los horarios de partidos de un campeonato', async () => {
		const res = await supertest(app)
			.get('/api/tournaments/1/schedule')
			.set('Authorization', `Bearer ${token}`);
		expect([200, 201]).toContain(res.statusCode);
		expect(Array.isArray(res.body.schedule)).toBe(true);
	});
	afterAll(() => {
		// No es necesario setTimeout aquí
	}, 20000);
});
// ...existing code...
// Este archivo fue convertido a ES Module
