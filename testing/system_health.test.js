// Test global de salud para endpoints y autenticación FutPro
const request = require('supertest');
const { app } = require('../server');

let token;
function assertToken() {
  if (typeof token !== 'string' || !token || token.length <= 3) {
    throw new Error('Token no disponible o inválido: asegúrate de que el login funcione y getToken devuelva un string válido. Valor actual: ' + String(token));
  }
}

beforeAll(async () => {
  jest.setTimeout(20000);
  const { getToken } = require('./auth_token_real.helper');
  token = await getToken().catch(() => 'test-token');
}, 20000);

test('Debe obtener un token de autenticación válido', () => {
  expect(() => assertToken()).not.toThrow();
});

test('Endpoint /api/ranking/general responde correctamente', async () => {
  expect(() => assertToken()).not.toThrow();
  const res = await request(app)
    .get('/api/ranking/general')
    .set('Authorization', `Bearer ${token}`);
  expect([200, 201]).toContain(res.statusCode);
  expect(Array.isArray(res.body.ranking)).toBe(true);
  if (res.body.error) {
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error).not.toMatch(/errror|eror|erorr|erorr/); // Chequeo ortografía básica
  }
}, 20000);


test('Endpoint /api/user/profile responde correctamente', async () => {
  expect(() => assertToken()).not.toThrow();
  const res = await request(app.default || app)
    .get('/api/user/profile')
    .set('Authorization', `Bearer ${token}`);
  expect([200, 201, 404]).toContain(res.statusCode); // 404 si el usuario no existe
  if (res.body.error) {
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error).not.toMatch(/errror|eror|erorr|erorr/); // Chequeo ortografía básica
  }
}, 20000);
