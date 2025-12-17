// src/api/client.js
import axios from 'axios';

const configuredApiUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const apiBase = configuredApiUrl;
const apiHost = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;

const client = axios.create({
  baseURL: apiHost,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Attach bearer token (if present) to every request so protected routes authenticate correctly
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
