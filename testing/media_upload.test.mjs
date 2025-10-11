import supertest from 'supertest';
import { app } from '../server.js';
import path from 'path';

describe('Subida de fotos y videos', () => {
	it('debe subir una foto correctamente', async () => {
		const res = await supertest(app)
			.post('/api/media/upload')
			.set('Authorization', 'Bearer test-token')
			.attach('media', path.join(process.cwd(), 'testing', 'fixtures', 'test.jpg'));
		expect([200,201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('url');
	});

	it('debe subir un video correctamente', async () => {
		const res = await supertest(app)
			.post('/api/media/upload')
			.set('Authorization', 'Bearer test-token')
			.attach('media', path.join(process.cwd(), 'testing', 'fixtures', 'test.mp4'));
		expect([200,201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('url');
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
