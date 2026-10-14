import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading indicator while reading credentials from localStorage
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading session...</div>;
  }

  // If not authenticated, redirect to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child route component
  return <Outlet />;
}