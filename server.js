
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './src/main/expressApp.js';
import webpush from 'web-push';
let io;

// Crear el servidor HTTP siempre (para tests y producción)
const server = http.createServer(app);
export { app, server };



// WebSocket para notificaciones y comentarios en tiempo real (solo si no es test)
if (process.env.NODE_ENV !== 'test') {
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
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}






// Web Push configuración (solo si usas notificaciones push)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:admin@futpro.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}



// Endpoint para comentarios con limpieza y asistencia IA
app.post('/comentario', async (req, res) => {
  try {
    // Placeholders seguros por si la IA no está conectada
    const limpiarEntrada = (s) => (typeof s === 'string' ? s.trim().replace(/[<>]/g, '') : '');
    const sugerirConIA = async () => null;
    const comentarioLimpio = limpiarEntrada(req.body.comentario);
    const sugerencia = await sugerirConIA(comentarioLimpio);
    res.json({
      status: 'ok',
      comentarioLimpio,
      sugerenciaIA: sugerencia
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






