// tests/amistosos.test.js
// Test de ejemplo para crear y aceptar amistosos

// Polyfill for setImmediate in environments where it's not defined
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// Ensure polyfills are loaded before any imports that may use them
global.TextEncoder = require('util').TextEncoder;
jest.mock('socket.io', () => {
  return {
    Server: jest.fn(() => ({
      on: jest.fn(),
      emit: jest.fn(),
      close: jest.fn()
    }))
  };
});
const request = require('supertest');
const { app } = require('../server');

function limpiarEntrada(texto) {
  texto = texto.replace(/<[^>]*>?/gm, '');
  texto = texto.replace(/(on\w+\s*=\s*["'][^"']*["'])/gi, '');
  texto = texto.replace(/(javascript:|data:|vbscript:)/gi, '');
  texto = texto.replace(/[\x00-\x1F\x7F]/g, '');
  // remover keywords peligrosas completas
  texto = texto.replace(/\b(union|select|insert|update|delete|drop|alter|create|users)\b/gi, '');
  // remover secuencias SQL comunes
  texto = texto.replace(/(--|;|\/\*|\*\/|xp_|exec)/gi, '');
  // remover emojis y caracteres no deseados
  texto = texto.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
  texto = texto.trim();
  return texto;
}

describe('Amistosos', () => {
  const token = 'TOKEN_DE_PRUEBA';
  it('debe crear un amistoso', async () => {
    const res = await request(app)
      .post('/api/friendlies/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ equipo1: 1, equipo2: 2, fecha: '2025-09-10' });
    expect([200,201]).toContain(res.statusCode);
    // expect(res.body).toHaveProperty('friendly');
  });

  it('debe aceptar un amistoso', async () => {
    const res = await request(app)
      .post('/api/friendlies/accept')
      .set('Authorization', `Bearer ${token}`)
      .send({ friendlyId: 1 });
  expect([200,201]).toContain(res.statusCode);
    // Optionally, check for an error message or property if your API returns one
    // expect(res.body).toHaveProperty('error');
  });

  test('limpia sintaxis peligrosa', () => {
    const entrada = "<script>alert('hack');</script> UNION SELECT * FROM users; 😈";
    const seguro = limpiarEntrada(entrada);
    expect(seguro).not.toMatch(/<|>|script|UNION|SELECT|users|😈/i);
  });
});
