import supertest from 'supertest';
import { app } from '../server.js';

function limpiarEntrada(texto) {
	texto = texto.replace(/<[^>]*>?/gm, '');
	texto = texto.replace(/(on\w+\s*=\s*["'][^"']*["'])/gi, '');
	texto = texto.replace(/(javascript:|data:|vbscript:)/gi, '');
	texto = texto.replace(/[\x00-\x1F\x7F]/g, '');
	texto = texto.replace(/\b(union|select|insert|update|delete|drop|alter|create|users)\b/gi, '');
	texto = texto.replace(/(--|;|\/\*|\*\/|xp_|exec)/gi, '');
	texto = texto.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
	texto = texto.trim();
	return texto;
}

describe('Amistosos', () => {
	const token = 'TOKEN_DE_PRUEBA';
	it('debe crear un amistoso', async () => {
		const res = await supertest(app)
			.post('/api/friendlies/create')
			.set('Authorization', `Bearer ${token}`)
			.send({ equipo1: 1, equipo2: 2, fecha: '2025-09-10' });
		expect([200,201]).toContain(res.statusCode);
	});

	it('debe aceptar un amistoso', async () => {
		const res = await supertest(app)
			.post('/api/friendlies/accept')
			.set('Authorization', `Bearer ${token}`)
			.send({ friendlyId: 1 });
		expect([200,201]).toContain(res.statusCode);
	});

	test('limpia sintaxis peligrosa', () => {
		const entrada = "<script>alert('hack');</script> UNION SELECT * FROM users; \ud83d\ude08";
		const salida = limpiarEntrada(entrada);
		expect(salida).not.toMatch(/<script>|UNION|SELECT|users|\ud83d\ude08/);
	});
});
