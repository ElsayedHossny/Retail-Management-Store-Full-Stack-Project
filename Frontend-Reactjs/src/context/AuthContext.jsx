// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';
import { AUTH_ENDPOINTS, AUTH_FIELDS } from '../api/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('retail_token'));
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // We don't have a "/me" endpoint guaranteed to exist, so we simply trust
    // a stored token until an API call comes back 401/403 (handled in pages).
    const storedUser = localStorage.getItem('retail_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('retail_user');
      }
    }
    setChecking(false);
  }, []);

  function persistSession(newToken, newUser) {
    if (newToken) {
      localStorage.setItem('retail_token', newToken);
      setToken(newToken);
    }
    if (newUser) {
      localStorage.setItem('retail_user', JSON.stringify(newUser));
      setUser(newUser);
    }
  }

  async function login(identifier, password) {
    const payload = {
      [AUTH_FIELDS.identifier]: identifier,
      [AUTH_FIELDS.password]: password,
    };
    const { data } = await client.post(AUTH_ENDPOINTS.login, payload);
    const returnedToken = data.token || data.accessToken;
    const returnedUser = data.user || { [AUTH_FIELDS.identifier]: identifier };
    if (!returnedToken) {
      throw new Error('Login succeeded but no token was returned by the API — check AUTH_ENDPOINTS in src/api/config.js');
    }
    persistSession(returnedToken, returnedUser);
    return returnedUser;
  }

  async function register(identifier, password) {
    const payload = {
      [AUTH_FIELDS.identifier]: identifier,
      [AUTH_FIELDS.password]: password,
    };
    const { data } = await client.post(AUTH_ENDPOINTS.register, payload);
    // Some backends log the user in immediately on register, some don't.
    if (data.token) {
      persistSession(data.token, data.user || { [AUTH_FIELDS.identifier]: identifier });
      return data.user;
    }
    return null; // caller should redirect to login
  }

  function logout() {
    localStorage.removeItem('retail_token');
    localStorage.removeItem('retail_user');
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    checking,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
