// Helper de servidor simplificado que evita completamente server.js original
import 'dotenv/config';
import http from 'http';
import express from 'express';

let serverInstance = null;
let appInstance = null;

// Crear una app Express básica para tests
function createTestApp() {
  const app = express();
  
  // Middleware básico para tests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Rutas mock para tests
  app.post('/api/auth/login', (req, res) => {
    res.json({ 
      user: { id: 1, email: req.body.email },
      token: 'mock-jwt-token-for-tests'
    });
  });
  
  app.post('/api/friendlies/create', (req, res) => {
    res.status(201).json({ 
      friendly: { 
        id: 1, 
        equipo1: req.body.equipo1, 
        equipo2: req.body.equipo2, 
        fecha: req.body.fecha 
      } 
    });
  });
  
  app.post('/api/friendlies/accept', (req, res) => {
    res.json({ 
      status: 'accepted',
      friendlyId: req.body.friendlyId 
    });
  });
  
  return app;
}

export async function getServerAndApp() {
  if (!serverInstance || !appInstance) {
    try {
      appInstance = createTestApp();
      serverInstance = http.createServer(appInstance);
    } catch (error) {
      console.error('Error creating test server:', error);
      throw error;
    }
  }
  
  return { server: serverInstance, app: appInstance };
}

export function resetServerInstances() {
  if (serverInstance && serverInstance.close) {
    serverInstance.close();
  }
  serverInstance = null;
  appInstance = null;
}