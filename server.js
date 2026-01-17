const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Map();

// Broadcast to all clients (including sender)
function broadcast(message) {
  const data = JSON.stringify(message);
  
  clients.forEach((clientInfo, client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Generate random user ID
  const userId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  clients.set(ws, { id: userId, username: `User${userId.substr(0, 4)}` });
  
  // Send user ID to client
  ws.send(JSON.stringify({
    type: 'connected',
    userId: userId,
    username: clients.get(ws).username
  }));
  
  // Send online users list to all clients
  const userList = Array.from(clients.values()).map(c => ({ id: c.id, username: c.username }));
  broadcast({
    type: 'userList',
    users: userList
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      if (message.type === 'message') {
        // Broadcast chat message to ALL clients (including sender)
        const clientInfo = clients.get(ws);
        broadcast({
          type: 'message',
          userId: clientInfo.id,
          username: clientInfo.username,
          text: message.text,
          timestamp: new Date().toISOString()
        });
      } else if (message.type === 'setUsername') {
        // Update username
        const clientInfo = clients.get(ws);
        clientInfo.username = message.username;
        
        // Update user list for all clients
        const userList = Array.from(clients.values()).map(c => ({ id: c.id, username: c.username }));
        broadcast({
          type: 'userList',
          users: userList
        });
      }
    } catch (err) {
      console.error('Invalid message format:', err);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
    
    // Send updated user list to all clients
    const userList = Array.from(clients.values()).map(c => ({ id: c.id, username: c.username }));
    broadcast({
      type: 'userList',
      users: userList
    });
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});