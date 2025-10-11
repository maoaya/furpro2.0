import supertest from 'supertest';
import { app } from '../server.js';

describe('Grupos de chat y ubicación', () => {
	const token = 'TOKEN_DE_PRUEBA';
	it('debe crear un grupo de chat', async () => {
		const res = await supertest(app)
			.post('/api/chat/groups/create')
			.set('Authorization', `Bearer ${token}`)
			.send({ nombre: 'Grupo de prueba' });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('group');
	});

	it('debe establecer ubicación de usuario', async () => {
		const res = await supertest(app)
			.post('/api/user/location')
			.set('Authorization', `Bearer ${token}`)
			.send({ lat: 10.123, lng: -74.123 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('location');
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
