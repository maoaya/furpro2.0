// Configurar TextEncoder/TextDecoder para tests de forma compatible con Jest
let textEncoderReady = false;

async function ensureTextEncoder() {
  if (!textEncoderReady && typeof global.TextEncoder === 'undefined') {
    const util = await import('util');
    global.TextEncoder = util.TextEncoder;
    global.TextDecoder = util.TextDecoder;
    textEncoderReady = true;
  }
}

import supertest from 'supertest';
import { getServerAndApp } from './server.helper.mjs';

const testUser = {
  email: 'testuser@example.com',
  password: 'Test1234!'
};

export async function getToken(srv) {
  await ensureTextEncoder();
  
  let target = srv;
  if (!target) {
    const { app } = await getServerAndApp();
    target = app;
  }
  
  const res = await supertest(target)
    .post('/api/auth/login')
    .send(testUser);
  if (!res.body.token) throw new Error('No se pudo obtener el token');
  return res.body.token;
}
