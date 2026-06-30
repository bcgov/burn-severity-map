// src/pages/Callback.tsx
import React, { useEffect, useState } from 'react';
import { initializeAuthService } from '../auth/authService';

const Callback = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuthService()
      .then((manager) => manager.signinRedirectCallback())
      .then(() => {
        window.location.replace('/');
      })
      .catch((err) => {
        console.error('Critical error processing login callback:', err);
        setError('Failed to validate secure login. Please try again');
      });
  }, []);

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.replace('/')}>Return to Home</button>
      </div>
    );
  }
  return <div style={{ padding: '20px', textAlign: 'center' }}><h3>Processing login...</h3><p>Validating credendtials</p></div>;
};

export default Callback;
