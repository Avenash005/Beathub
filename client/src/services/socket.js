import { io } from 'socket.io-client';

// Socket.io server URL
const SERVER_URL = 'http://localhost:5000';

// Create socket instance with autoConnect: false
// This gives us manual control over when to connect
export const socket = io(SERVER_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  // auth option is set dynamically when connecting
  auth: {}
});

// Update auth token before connecting
export const updateSocketAuth = () => {
  const token = localStorage.getItem('token');
  socket.auth = { token: token || '' };
};

export default socket;
