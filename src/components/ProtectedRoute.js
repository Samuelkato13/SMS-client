import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDenied from '../pages/AccessDenied';

// Role-based access control configuration
const rolePermissions = {
  admin: [
    '/dashboard', '/students', '/classes', '/subjects', '/exams', '/marks', 
    '/attendance', '/fees', '/users', '/schools', '/reports', '/payments'
  ],
  director: [
    '/dashboard', '/students', '/classes', '/subjects', '/exams', 
    '/marks/analytics', '/attendance/analytics', '/fees/analytics', 
    '/users', '/reports'
  ],
  head_teacher: [
    '/dashboard', '/students', '/classes', '/subjects', '/exams',
    '/marks', '/marks/analytics', '/attendance', '/attendance/analytics',
    '/fees/analytics', '/users', '/reports'
  ],
  bursar: [
    '/dashboard', '/students', '/fees', '/reports/financial'
  ],
  class_teacher: [
    '/dashboard', '/students', '/marks', '/attendance', '/reports/academic'
  ],
  subject_teacher: [
    '/dashboard', '/students', '/marks', '/reports/academic'
  ]
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no specific role is required, allow access
  if (!requiredRole) {
    return children;
  }

  // Check if user has the required role
  if (user?.role !== requiredRole) {
    // Redirect to dashboard or show access denied
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Hook to check if user has access to a specific path
export const useRouteAccess = (path) => {
  const { user } = useAuth();
  
  if (!user?.role) return false;
  
  const allowedPaths = rolePermissions[user.role] || [];
  
  // Check if the path or any of its sub-paths are allowed
  return allowedPaths.some(allowedPath => 
    path === allowedPath || path.startsWith(allowedPath + '/')
  );
};

// Component to show access denied page
export const RouteAccessGuard = ({ children, path }) => {
  const hasAccess = useRouteAccess(path);
  
  if (!hasAccess) {
    return <AccessDenied />;
  }
  
  return children;
};

export default ProtectedRoute; 