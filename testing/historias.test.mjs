import supertest from 'supertest';
import { app } from '../server.js';

describe('Historias', () => {
	const token = 'TOKEN_DE_PRUEBA';
	it('debe publicar una historia', async () => {
		const res = await supertest(app)
			.post('/api/stories/publish')
			.set('Authorization', `Bearer ${token}`)
			.send({ mediaUrl: 'https://test.com/story.jpg', texto: 'Historia de prueba' });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('story');
	});

	it('debe ver historias', async () => {
		const res = await supertest(app)
			.get('/api/stories')
			.set('Authorization', `Bearer ${token}`);
		expect([200, 404]).toContain(res.statusCode);
		if (res.statusCode === 200) {
			expect(Array.isArray(res.body.stories)).toBe(true);
		}
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
