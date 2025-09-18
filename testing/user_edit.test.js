// Test de ejemplo para edición y guardado de datos de usuario
const request = require('supertest');
const { app } = require('../server');

describe('Edición y guardado de datos de usuario', () => {
  const token = 'TOKEN_DE_PRUEBA'; // Reemplaza por un token válido en pruebas reales
  it('debe editar datos del usuario', async () => {
    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'NuevoNombre', bio: 'Bio actualizada' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('user');
  });
});
