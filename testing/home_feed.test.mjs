import supertest from 'supertest';
import { app } from '../server.js';

describe('HomePage tipo Instagram', () => {
	const token = 'TOKEN_DE_PRUEBA';
	it('debe mostrar el feed principal', async () => {
		const res = await supertest(app)
			.get('/api/feed')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.feed)).toBe(true);
	});

	it('debe mostrar historias en el feed', async () => {
		const res = await supertest(app)
			.get('/api/feed/stories')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.stories)).toBe(true);
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
