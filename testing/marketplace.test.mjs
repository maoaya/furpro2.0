import supertest from 'supertest';
import { app } from '../server.js';

describe('Marketplace', () => {
	const token = 'TOKEN_DE_PRUEBA';
	it('debe publicar un producto', async () => {
		const res = await supertest(app)
			.post('/api/marketplace/publish')
			.set('Authorization', `Bearer ${token}`)
			.send({ nombre: 'Balón', precio: 100 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('product');
	});

	it('debe comprar un producto', async () => {
		const res = await supertest(app)
			.post('/api/marketplace/buy')
			.set('Authorization', `Bearer ${token}`)
			.send({ productId: 1 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('order');
	});

	it('debe editar un producto', async () => {
		const res = await supertest(app)
			.put('/api/marketplace/edit/1')
			.set('Authorization', `Bearer ${token}`)
			.send({ precio: 120 });
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('product');
	});
});
// ...existing code...
// Este archivo fue convertido a ES Module
