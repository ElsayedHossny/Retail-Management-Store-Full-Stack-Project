// src/api/client.js
import axios from 'axios';
import { API_BASE_URL } from './config';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the stored token (if any) to every outgoing request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('retail_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend says the token is invalid/expired, clear it so the
// user gets sent back to login instead of seeing silent failures.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      // Let AuthContext decide what to do; we just surface the error here.
    }
    return Promise.reject(err);
  }
);

export default client;
