// ProtectedRoute.tsx (Assuming located in src/auth/)
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom'; 
import { useAuth } from './AuthContext'; 

// Simple Loading component
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <p>{message}</p>
  </div>
);

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
  fallbackMessage?: string | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, fallbackMessage}) => {
  const { isAuthenticated, isLoadingAuth, roles } = useAuth(); // Destructure new states

  // 1. Show loading state if auth status is still being determined
  if (isLoadingAuth) {
    return <LoadingSpinner message="Checking authentication status..." />;
  }

  // 2. If not authenticated after loading, redirect to login page
  if (!isAuthenticated) {
    // Use React Router's Navigate component for redirection
    // 'replace' ensures that the login page replaces the current entry in the history stack,
    // so the user can't just hit back to bypass the protection.
    // You might also consider passing state to the login page to let it know where the user came from.
    // if the login page changes... change this to="/login"
    return <Navigate to="/" replace />;
  }
  // 3. Check for role if one is required
  if (requiredRole && !roles.includes(requiredRole)) {
    return (
      fallbackMessage ? (fallbackMessage) : (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>You do not have the '{requiredRole}' permissions required to view this page.</p>
          <Navigate to="/" replace /> 
        </div>
      )
    );
  }

  // 4. If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;