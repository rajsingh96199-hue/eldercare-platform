import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if JWT token exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eldercare_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle unauthenticated 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Clear expired session
      localStorage.removeItem('eldercare_token');
      localStorage.removeItem('eldercare_user');
    }
    return Promise.reject(error);
  }
);

export default api;
