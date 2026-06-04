const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Sample API endpoint
app.get('/api/posts', (req, res) => {
  res.json([
    { id: 1, title: 'Getting Started with Socket.io', author: 'Jane Doe' },
    { id: 2, title: 'Real-Time Features in React', author: 'John Smith' }
  ]);
});

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.io ready at http://localhost:${PORT}`);
});
