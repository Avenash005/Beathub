import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Do NOT set Content-Type here - let the browser set it automatically for FormData
    // This is critical for file uploads to work correctly
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
      } else if (status === 500) {
        console.error('Server error:', data.message);
      }
    } else if (error.request) {
      console.error('Network error - server may be down');
    }
    
    return Promise.reject(error);
  }
);

export default api;
