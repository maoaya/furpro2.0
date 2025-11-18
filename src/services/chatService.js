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
    const response = await fetch('/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(msg)
    });
    if (response.status === 401) {
      // Token inválido o expirado, redirigir al login
      window.location.href = '/login';
      return;
    }
  },
  disconnect() {
    if (socket) socket.disconnect();
  },
};

export default chatService;
