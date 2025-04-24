import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  // While checking authentication state, show nothing
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
} 