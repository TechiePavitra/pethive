import axios from 'axios';

// Determine the API base URL based on environment
const getBaseURL = () => {
  // Check if we're NOT in localhost (i.e., we're on production like Vercel)
  const isNotLocalhost = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  // On production, ALWAYS use relative /api path
  if (isNotLocalhost) {
    console.log('🌐 Production environment detected, using /api');
    return '/api';
  }
  
  // On local development, check for explicit env var, otherwise use localhost proxy
  const viteApiUrl = import.meta.env.VITE_API_URL;
  if (viteApiUrl && viteApiUrl !== 'http://localhost:3001/api') {
    console.log('🔧 Using VITE_API_URL:', viteApiUrl);
    return viteApiUrl;
  }
  
  // Default for local dev (uses Vite proxy configured in vite.config.js)
  console.log('🔧 Local development, using Vite proxy to /api');
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 10000,
});

// Log API configuration
console.log('🔧 API Base URL:', api.defaults.baseURL);
console.log('🔧 Hostname:', window.location.hostname);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Don't log expected 401 from /auth/me (user not logged in)
      const url = error.response.config?.url || '';
      if (error.response.status === 401 && url.includes('/auth/me')) {
        // Silently handle — AuthContext already manages this
      } else {
        console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response from server');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
