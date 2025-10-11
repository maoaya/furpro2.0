import supertest from 'supertest';
import { app } from '../server.js';

describe('Horarios de partidos', () => {
	const token = 'TOKEN_DE_PRUEBA';
	it('debe mostrar los horarios de partidos de un campeonato', async () => {
		const res = await supertest(app)
			.get('/api/tournaments/1/schedule')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.schedule)).toBe(true);
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
