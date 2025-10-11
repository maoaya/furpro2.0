import supertest from 'supertest';
import { app } from '../server.js';
import path from 'path';

describe('Foto de perfil', () => {
	const token = 'TOKEN_DE_PRUEBA';
	it('debe subir una foto de perfil', async () => {
		const res = await supertest(app)
			.post('/api/user/profile/photo')
			.set('Authorization', `Bearer ${token}`)
			.attach('file', path.join(process.cwd(), 'testing', 'fixtures', 'profile.jpg'));
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('photoUrl');
	});

	it('debe cambiar la foto de perfil', async () => {
		const res = await supertest(app)
			.put('/api/user/profile/photo')
			.set('Authorization', `Bearer ${token}`)
			.attach('file', path.join(process.cwd(), 'testing', 'fixtures', 'profile2.jpg'));
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('photoUrl');
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
