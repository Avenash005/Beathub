import { useEffect, useState } from 'react';
import socket, { updateSocketAuth } from '../services/socket';
import toast from 'react-hot-toast';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    // Update auth token before connecting
    updateSocketAuth();

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

    // Handler for newPost events - shows toast notification
    const handleNewPost = (data) => {
      console.log('Received newPost event:', data);
      toast.success(data.message);
      
      // Refetch posts after new post is created
      fetchPosts();
    };

    // Add event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('newPost', handleNewPost);

    // Connect to Socket.io server
    socket.connect();

    // Fetch posts
    fetchPosts();

    // Cleanup function - runs when component unmounts
    return () => {
      // Remove event listeners to prevent memory leaks
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('newPost', handleNewPost);

      // Disconnect the socket
      socket.disconnect();
      console.log('Socket cleanup completed');
    };
  }, []);

  // Fetch posts from API
  const fetchPosts = () => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err));
  };

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
            <li key={post.id} className="post-item">
              {/* Conditionally render cover image */}
              {post.coverImage && (
                <img 
                  src={post.coverImage} 
                  alt={`Cover image for ${post.title}`}
                  className="post-cover-image"
                />
              )}
              <h4>{post.title}</h4>
              <p>By: {post.author}</p>
              {post.content && <p className="post-content">{post.content}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
