// src/api/config.js
//
// One place to point this dashboard at your backend.
// If your existing login/registration routes use different paths or field
// names than the defaults below, this is the only file you need to edit.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const AUTH_ENDPOINTS = {
  login: '/auth/login', // expects { username, password } -> { token, user }
  register: '/auth/register', // expects { username, password } -> { token, user } or { message }
};

// Field names sent to the login/register endpoints.
// Change to { email: 'email', password: 'password' } etc. if your backend differs.
export const AUTH_FIELDS = {
  identifier: 'username',
  password: 'password',
};
