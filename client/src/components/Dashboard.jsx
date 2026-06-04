import { useEffect, useState } from 'react';
import socket from '../services/socket';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    // Define event handlers
    const handleConnect = () => {
      console.log('Connected to server with ID:', socket.id);
      setConnectionStatus('connected');
      setSocketId(socket.id);
    };

    const handleDisconnect = () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
      setSocketId(null);
    };

    const handleConnectError = (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('error');
    };

    // Add event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Connect to Socket.io server
    socket.connect();

    // Fetch posts from API
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err));

    // Cleanup function - runs when component unmounts
    return () => {
      // Remove event listeners to prevent memory leaks
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);

      // Disconnect the socket
      socket.disconnect();
      console.log('Socket cleanup completed');
    };
  }, []);

  return (
    <div className="dashboard">
      <h1>Creator's Platform Dashboard</h1>
      
      <div className="connection-status">
        <h3>Connection Status:</h3>
        <p>Status: <span className={connectionStatus}>{connectionStatus}</span></p>
        {socketId && <p>Socket ID: {socketId}</p>}
      </div>

      <div className="posts-section">
        <h3>Latest Posts</h3>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h4>{post.title}</h4>
              <p>By: {post.author}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
