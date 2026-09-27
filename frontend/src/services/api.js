import axios from 'axios';

// Axios instance — proxy in vite.config.js routes /api → localhost:5000
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
