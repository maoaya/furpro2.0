// Servicio de chat en tiempo real usando socket.io
import io from 'socket.io-client';
let socket;

const chatService = {
  connect(roomId, onMessage) {
    socket = io('/'); // Cambia la URL según tu backend
    socket.emit('join', roomId);
    socket.on('message', onMessage);
  },
  async sendMessage(msg, token) {
    await fetch('/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(msg)
    });
  },
  disconnect() {
    if (socket) socket.disconnect();
  },
};

export default chatService;
