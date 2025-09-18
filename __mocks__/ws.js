// Mock para ws en tests Jest
class WebSocketServer {
  constructor() {}
  on() {}
  clients = [];
}
module.exports = { WebSocketServer };