
import axios from 'axios';

let cleanBaseURL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
if (cleanBaseURL.endsWith('/api')) {
  cleanBaseURL = cleanBaseURL.slice(0, -4);
}

const baseURL = cleanBaseURL ? `${cleanBaseURL}/api` : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ` + token;
  return config;
});

export default api;
