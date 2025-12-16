import axios from 'axios';

// Backend berjalan di port 8000
const BASE_URL = 'http://localhost:8000/api/';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan Token JWT secara otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;