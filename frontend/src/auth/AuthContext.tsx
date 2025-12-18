// src/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState,useCallback } from 'react';
import { User } from 'oidc-client-ts';
import userManager from './authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  roles: string[];
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
  isLoadingAuth: boolean;
  authError: Error | null;
  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Start as true
  const [authError, setAuthError] = useState<Error | null>(null); // For OIDC errors
  const [roles, setRoles] = useState<string[]>([]);

  const handleUserLoaded = useCallback((loadedUser: User) => {
    setUser(loadedUser);
    setIsLoadingAuth(false); // Auth status determined
    setAuthError(null); // Clear any previous errors on successful load
  }, []);

  const handleUserUnloaded = useCallback(() => {
    setUser(null);
    setIsLoadingAuth(false); // Auth status determined
    setAuthError(null); // Clear any previous errors on unload
  }, []);

  const handleUserSignedOut = useCallback(() => {
    setUser(null);
    setIsLoadingAuth(false);
    setAuthError(null);
  }, []);

  const handleAccessTokenExpired = useCallback(() => {
    // This is fired when the access token expires.
    // OIDC client might try to silently refresh.
    // If not, you might want to force a re-login or show a message.
    console.warn("Access Token Expired. Attempting silent renew if configured.");
    // setUser(null); // Uncomment if you want to immediately clear user on expiration
  }, []);

  const handleUserSessionChanged = useCallback(() => {
    // This is fired if user session changes (e.g., from another tab)
    userManager.getUser().then(user => {
      if (user && !user.expired) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleAuthError = useCallback((error: Error) => {
    console.error("Authentication Error:", error);
    setAuthError(error);
    setIsLoadingAuth(false); // Stop loading on error
  }, []);

  useEffect(() => {
    if (user) {
      // Keycloak standard: user.profile.client_roles or user.profile.roles
      const userRoles = (user.profile?.roles as string[]) || 
                        (user.profile?.client_roles as string[]) || [];
      setRoles(userRoles);
    } else {
      setRoles([]);
    }
  }, [user]);

  useEffect(() => {
    // Initial check for existing user session
    userManager.getUser()
      .then(user => {
        if (user && !user.expired) {
          setUser(user);
        } else {
          setUser(null); // No valid user or expired
        }
      })
      .catch(error => {
        console.error("Error getting initial user:", error);
        setAuthError(error);
        setUser(null);
      })
      .finally(() => {
        setIsLoadingAuth(false); // Regardless of outcome, initial check is complete
      });

    // Subscribe to OIDC events
    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addUserSignedOut(handleUserSignedOut); // Often same as UserUnloaded, but good to listen
    userManager.events.addAccessTokenExpired(handleAccessTokenExpired);
    userManager.events.addUserSessionChanged(handleUserSessionChanged);
    userManager.events.addSilentRenewError(handleAuthError); // Handle silent renew errors
    userManager.events.addAccessTokenExpiring(() => { /* Optional: prepare for renew */ });

    // Cleanup event listeners on unmount
    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeUserSignedOut(handleUserSignedOut);
      userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
      userManager.events.removeUserSessionChanged(handleUserSessionChanged);
      userManager.events.removeSilentRenewError(handleAuthError);
      userManager.events.removeAccessTokenExpiring(() => { /* Clean up if you added something */ });
    };
  }, [handleUserLoaded, handleUserUnloaded, handleUserSignedOut, handleAccessTokenExpired, handleUserSessionChanged, handleAuthError]); // Add useCallback dependencies

  const login = () => {
    setIsLoadingAuth(true); // Indicate that a login flow is starting
    userManager.signinRedirect().catch(error => {
      console.error("Signin redirect failed:", error);
      setAuthError(error);
      setIsLoadingAuth(false); // Stop loading if redirect fails
    });
  };

  const logout = () => {
    setIsLoadingAuth(true); // Indicate logout process
    userManager.signoutRedirect().catch(error => {
      console.error("Signout redirect failed:", error);
      setAuthError(error);
      setIsLoadingAuth(false); // Stop loading if redirect fails
    });
  };

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const currentUser = await userManager.getUser();
    if (currentUser && !currentUser.expired) {
      return currentUser.access_token;
    }
    return null;
  }, []);

  const isAuthenticated = !!user && !user.expired; // Derive isAuthenticated

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, roles, getAccessToken, isLoadingAuth, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};