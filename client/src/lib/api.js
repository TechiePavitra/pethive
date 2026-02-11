import axios from 'axios';

// Determine the API base URL based on environment
const getBaseURL = () => {
  // Check if we're in production (Vercel)
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // On production (Vercel), use relative /api path (routes to backend)
    return '/api';
  }
  
  // Local development - use explicit environment variable or default to /api
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to /api
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 10000,
});

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Base URL:', api.defaults.baseURL);
  console.log('🔧 Hostname:', window.location.hostname);
  console.log('🔧 IsProduction:', window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
}

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
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
