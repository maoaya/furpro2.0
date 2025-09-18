// Servidor WebSocket para notificaciones en tiempo real
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // Broadcast a todos los clientes
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.send(JSON.stringify({ type: 'welcome', msg: 'Conectado a notificaciones FutPro' }));
});

console.log('WebSocket de notificaciones en tiempo real escuchando en ws://localhost:8080');
