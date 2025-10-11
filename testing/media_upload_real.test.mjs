import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';
let app;
import path from 'path';
let getToken;

describe('Subida de fotos (real)', () => {
	let token;
	beforeAll(async () => {
		({ app } = await getServerAndApp());
		({ getToken } = await import('./auth_token_real.helper.mjs'));
		token = await getToken();
	}, 20000);

	it('debe subir una foto correctamente', async () => {
		const res = await supertest(app)
			.post('/api/media/upload')
			.set('Authorization', `Bearer ${token}`)
			.attach('file', path.join(process.cwd(), 'testing', 'fixtures', 'test.jpg'));
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('url');
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
