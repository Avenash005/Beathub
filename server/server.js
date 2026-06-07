const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creators-platform';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
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

// Socket.io authentication middleware
io.use((socket, next) => {
  // Get token from socket handshake auth
  const token = socket.handshake.auth.token;
  
  if (!token) {
    console.log('Connection rejected: No token provided');
    return next(new Error('No token'));
  }
  
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.io ready at http://localhost:${PORT}`);
  });
};

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Try to connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    // If MongoDB connection fails, continue without it (development mode)
    console.log('MongoDB connection failed, using in-memory storage:', err.message);
  }

  // Start the server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.io ready at http://localhost:${PORT}`);
  });
};

startServer();
