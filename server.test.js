// Versión del servidor para tests que evita importaciones dinámicas problemáticas
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './src/main/expressApp.js';

let io;

// Crear el servidor HTTP siempre (para tests y producción)
const server = http.createServer(app);

// En modo test, no inicializar WebSocket para evitar problemas
if (process.env.NODE_ENV !== 'test') {
  // Función async para manejar la inicialización
  (async () => {
    try {
      const { WebSocketServer } = await import('ws');
      io = new Server(server, {
        cors: { origin: '*' }
      });
      const wss = new WebSocketServer({ server });
      app.set('wss', wss);
      
      // Socket.io para streaming y chat
      io.on('connection', (socket) => {
        socket.on('join-stream', (streamId) => {
          socket.join(streamId);
          io.to(streamId).emit('viewer-joined', socket.id);
        });
        socket.on('send-message', (data) => {
          io.emit('new-message', data);
        });
        socket.on('disconnect', () => {});
      });
    } catch (error) {
      console.warn('WebSocket initialization skipped:', error.message);
    }
  })();
}

export { app, server, io };