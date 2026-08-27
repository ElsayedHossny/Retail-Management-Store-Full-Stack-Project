// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAuth();

  if (checking) return <div className="loading-line">Checking session…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
