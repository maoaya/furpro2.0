import { Server } from 'socket.io';

export function setupStreaming(server) {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', socket => {
    socket.on('join-stream', streamId => {
      socket.join(streamId);
      io.to(streamId).emit('viewer-joined', socket.id);
    });
  });
}
