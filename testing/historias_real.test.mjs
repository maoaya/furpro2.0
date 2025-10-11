import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';
let app;
let getToken;

describe('Historias (real)', () => {
	let token;
	beforeAll(async () => {
		({ app } = await getServerAndApp());
		({ getToken } = await import('./auth_token_real.helper.mjs'));
		token = await getToken();
	}, 20000);

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
		expect([200, 201, 404]).toContain(res.statusCode);
		if (res.statusCode === 200 || res.statusCode === 201) {
			expect(Array.isArray(res.body.stories)).toBe(true);
		}
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
