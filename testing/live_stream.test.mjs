import supertest from 'supertest';
import { app } from '../server.js';

describe('Transmisión en vivo', () => {
	const token = 'TOKEN_DE_PRUEBA';
	it('debe iniciar una transmisión en vivo', async () => {
		const res = await supertest(app)
			.post('/api/live/start')
			.set('Authorization', `Bearer ${token}`)
			.send({ titulo: 'Transmisión de prueba' });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('streamUrl');
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
