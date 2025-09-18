import { Server } from 'socket.io';

export function setupChat(server) {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', socket => {
    socket.on('send-message', data => {
      io.emit('new-message', data);
    });
  });
}
