import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// This component protects routes based on authentication and roles
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  // If the user is not logged in, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, verify the user has at least one of them
  if (allowedRoles && allowedRoles.length > 0) {
    // Note: the backend returns the roles array as "role"
    const hasRequiredRole = user?.role?.some(r => allowedRoles.includes(r.id));
    
    if (!hasRequiredRole) {
      // User doesn't have the required permissions, redirect to the home page
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
}