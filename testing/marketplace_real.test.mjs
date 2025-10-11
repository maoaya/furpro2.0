import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';
let getToken;
let server;

describe('Marketplace (real)', () => {
	let token;
	let testServer;
	beforeAll(async () => {
		({ server } = await getServerAndApp());
		testServer = server;
		if (!server.listening) {
			server.listen(0);
		}
    ({ getToken } = await import('./auth_token_real.helper.mjs'));
		token = await getToken(testServer);
	}, 20000);
	afterAll((done) => {
		if (testServer && testServer.close) testServer.close(done);
	}, 20000);

	it('debe publicar un producto', async () => {
		const res = await supertest(testServer)
			.post('/api/marketplace/publish')
			.set('Authorization', `Bearer ${token}`)
			.send({ nombre: 'Balón', precio: 100 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('product');
	});

	it('debe comprar un producto', async () => {
		const res = await supertest(testServer)
			.post('/api/marketplace/buy')
			.set('Authorization', `Bearer ${token}`)
			.send({ productId: 1 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('order');
	});

	it('debe editar un producto', async () => {
		const res = await supertest(testServer)
			.put('/api/marketplace/edit/1')
			.set('Authorization', `Bearer ${token}`)
			.send({ precio: 120 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('product');
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
