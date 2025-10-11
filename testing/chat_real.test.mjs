import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';
let app;
let getToken;

describe('Chat (real)', () => {
	let token;
	beforeAll(async () => {
		({ app } = await getServerAndApp());
		({ getToken } = await import('./auth_token_real.helper.mjs'));
		token = await getToken();
	}, 20000);
	it('debe enviar un mensaje correctamente', async () => {
		const res = await supertest(app)
			.post('/chat/message')
			.set('Authorization', `Bearer ${token}`)
			.send({ to: 'usuario2', mensaje: '¡Hola desde test!' });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('success', true);
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
