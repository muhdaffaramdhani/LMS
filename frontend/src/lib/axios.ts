import axios from 'axios';

// Pastikan port 8000 (sesuai docker-compose backend)
const BASE_URL = 'http://localhost:8000/api/';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor ini sudah benar untuk menangani Token JWT
api.interceptors.request.use(
  (config) => {
    // Backend Anda menggunakan 'access_token' untuk nama key di localStorage (sesuai authService.ts)
    const token = localStorage.getItem('access_token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;