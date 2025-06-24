// src/pages/RootPage.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext'; // Import your auth context
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner'; // If you want to show a spinner here too

const RootPage: React.FC = () => {
  const { user, login, isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingAuth) { // Only act after auth status is determined
      if (isAuthenticated) {
        // If user is already authenticated, redirect them to a default authenticated page
        navigate('/map', { replace: true });
      } else {
        // If not authenticated, prompt for login (e.g., show a login button)
        // Or, if your app is designed to immediately kick off IdP login, you might call login() here:
        // login(); // <-- ONLY if you want to immediately redirect to IdP
      }
    }
  }, [isLoadingAuth, isAuthenticated, navigate, login]);

  if (isLoadingAuth) {
    return <LoadingSpinner message="Checking session..." />;
  }

  if (isAuthenticated) {
    // This part should ideally not be reached if the useEffect redirects immediately
    return <div>Welcome! Redirecting...</div>;
  }

  // If not authenticated and not loading, show login prompt or landing page content
  return (
    <div>
      <h1>Welcome to the App!</h1>
      <p>Please log in to continue.</p>
      <button onClick={login}>Log In</button> {/* This button calls your oidc-client-ts signinRedirect */}
    </div>
  );
};

export default RootPage;