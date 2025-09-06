import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000',
});

API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('ecofinds_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default API;
