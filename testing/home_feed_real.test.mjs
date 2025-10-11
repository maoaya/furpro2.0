import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';
let app;
let getToken;

describe('HomePage tipo Instagram (real)', () => {
	let token;
	beforeAll(async () => {
		({ app } = await getServerAndApp());
		({ getToken } = await import('./auth_token_real.helper.mjs'));
		token = await getToken();
	}, 20000);

	it('debe mostrar el feed principal', async () => {
		const res = await supertest(app)
			.get('/api/feed')
			.set('Authorization', `Bearer ${token}`);
		expect([200, 201]).toContain(res.statusCode);
		expect(Array.isArray(res.body.feed)).toBe(true);
	});

	it('debe mostrar historias en el feed', async () => {
		const res = await supertest(app)
			.get('/api/feed/stories')
			.set('Authorization', `Bearer ${token}`);
		expect([200, 201]).toContain(res.statusCode);
		expect(Array.isArray(res.body.stories)).toBe(true);
	});
	afterAll(() => {
		// No es necesario setTimeout aquí
	}, 20000);
});
// ...existing code...
// Este archivo fue convertido a ES Module
