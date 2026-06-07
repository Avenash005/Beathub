const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// JWT Secret for token verification
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creators-platform';

// Test MongoDB connection string
const MONGODB_URI_TEST = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/creators-platform-test';

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
  
  // Verify the JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Connection rejected: Invalid token');
      return next(new Error('Invalid token'));
    }
    
    // Store user data in socket for later use
    socket.data.user = decoded;
    console.log('Token verified for user:', decoded.email || decoded.username || 'unknown');
    next();
  });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  const userEmail = socket.data.user?.email || socket.data.user?.username || 'unknown';
  console.log(`User connected: ${socket.id} (${userEmail})`);

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Import and use auth router
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Import and use posts router with io
const postsRouter = require('./routes/posts')(io);
app.use('/api', postsRouter);

// Import and use upload router
const uploadRouter = require('./routes/upload');
app.use('/api', uploadRouter);

// Database connection function
const connectDB = async () => {
  try {
    // Use test database if NODE_ENV is test
    const uri = process.env.NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (err) {
    console.log('MongoDB connection failed, using in-memory storage:', err.message);
    return null;
  }
};

// Export app, server, and connectDB for testing
module.exports = { app, server, io, connectDB };

// Start server if this file is run directly
if (require.main === module) {
  const startServer = async () => {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Socket.io ready at http://localhost:${PORT}`);
    });
  };
  
  startServer();
}
