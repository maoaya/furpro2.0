import supertest from 'supertest';
import { app } from '../server.js';

const testUser = {
	email: 'testuser@example.com',
	password: 'Test1234!'
};

export async function getToken(srv) {
	const target = srv || app;
	const res = await supertest(target)
		.post('/api/auth/login')
		.send(testUser);
	if (!res.body.token) throw new Error('No se pudo obtener el token');
	return res.body.token;
}

describe('auth_token_real helper', () => {
	test('expone getToken como función', () => {
		expect(typeof getToken).toBe('function');
	});
});
