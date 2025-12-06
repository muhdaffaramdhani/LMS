import axios from 'axios';

// URL Backend Docker Anda
const BASE_URL = 'http://localhost:8000/api/';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Otomatis pasang token JWT jika user sudah login
api.interceptors.request.use(
  (config) => {
    // Backend teman Anda menyimpan token dengan nama 'access_token'
    const token = localStorage.getItem('access_token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;