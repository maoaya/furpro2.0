import supertest from 'supertest';
import { getServerAndApp } from './server.simple.helper.mjs';

describe('Amistosos (test simple)', () => {
  let app;
  
  beforeAll(async () => {
    ({ app } = await getServerAndApp());
  }, 10000);

  it('debe crear un amistoso con mock server', async () => {
    const res = await supertest(app)
      .post('/api/friendlies/create')
      .send({ equipo1: 1, equipo2: 2, fecha: '2025-09-10' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('friendly');
    expect(res.body.friendly).toHaveProperty('id');
  });

  it('debe aceptar un amistoso con mock server', async () => {
    const res = await supertest(app)
      .post('/api/friendlies/accept')
      .send({ friendlyId: 1 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'accepted');
  });
});