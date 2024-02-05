const WebSocket = require('ws');

let webSocketServer;
const clients = {
  Admin: [],
  User: [],
};

function initializeWebSocketServer(server) {
  webSocketServer = new WebSocket.Server({ server });

  // Handle connection logic
  webSocketServer.on('connection', (ws) => {
    console.log('A new client connected');

    // Assume the client sends its group when connecting
    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      const group = parsedMessage.group || 'User'; // Default to 'User' if no group specified

      // Add the client to the appropriate group
      if (!clients[group]) {
        clients[group] = [];
      }

      clients[group].push(ws);

      console.log(`Client joined group ${group}`);
    });
  });

  console.log('WebSocket server initialized');

  return webSocketServer;
}

function broadcastUpdates(data, group) {
  if (webSocketServer && clients[group]) {
    clients[group].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = { initializeWebSocketServer, broadcastUpdates };
