/** @format */

import axios from 'axios';

const configuredBaseURL = (import.meta.env.VITE_API_URL || '/api').replace(
  /\/+$/,
  '',
);
const baseURL = configuredBaseURL.endsWith('/api')
  ? configuredBaseURL
  : `${configuredBaseURL}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// call token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ` + token;
  return config;
});

export default api;
