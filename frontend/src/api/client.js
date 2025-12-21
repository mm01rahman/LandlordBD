// src/api/client.js
import axios from 'axios';

const configuredApiUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const apiBase = configuredApiUrl;
const apiHost = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false, // 🔒 NO cookies
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default client;
