import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';
let server;

const testUser = {
	email: 'testuser@example.com',
	password: 'Test1234!'
};
let testServer;

describe('Auth (real)', () => {
	beforeAll(async () => {
		({ server } = await getServerAndApp());
		testServer = server;
		if (!server.listening) {
			server.listen(0);
		}
	}, 20000);
	afterAll((done) => {
		if (testServer && testServer.close) testServer.close(done);
	}, 20000);

	it('debe registrar un usuario nuevo', async () => {
		const res = await supertest(testServer)
			.post('/api/auth/register')
			.send(testUser);
		expect([200, 201]).toContain(res.statusCode);
		expect(res.body).toHaveProperty('user');
	}, 20000);

	it('debe permitir login con usuario registrado', async () => {
		const res = await supertest(testServer)
			.post('/api/auth/login')
			.send(testUser);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('token');
	}, 20000);

	it('debe permitir recuperación de contraseña', async () => {
		const res = await supertest(testServer)
			.post('/api/auth/recover')
			.send({ email: testUser.email });
		expect([200, 201]).toContain(res.statusCode);
	}, 20000);
});
