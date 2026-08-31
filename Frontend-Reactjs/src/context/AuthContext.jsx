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

  function persistSession(newUser) {
    const sessionToken = 'session';
    localStorage.setItem('retail_token', sessionToken);
    setToken(sessionToken);
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
    if (data.status === false) {
      throw new Error(data.message || 'Could not sign in');
    }
    const returnedUser = data.User || data.user || { [AUTH_FIELDS.identifier]: identifier };
    persistSession(returnedUser);
    return returnedUser;
  }

  async function register({ name, email, password, age, gender }) {
    const payload = { name, email, password, age, gender };
    const { data } = await client.post(AUTH_ENDPOINTS.register, payload);
    if (data.status === false) {
      throw new Error(data.message || 'Could not register');
    }
    return null;
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
    isAuthenticated: Boolean(user),
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
