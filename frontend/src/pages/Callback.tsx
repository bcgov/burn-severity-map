// src/Callback.tsx
import React, { useEffect } from 'react';
import userManager from '../auth/authService';

const Callback = () => {
  useEffect(() => {
    userManager.signinRedirectCallback().then(() => {
      window.location.replace('/');
    });
  }, []);

  return <div>Processing login...</div>;
};

export default Callback;
