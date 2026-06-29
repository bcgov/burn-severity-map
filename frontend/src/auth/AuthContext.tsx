// src/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState,useCallback } from 'react';
import { User, UserManager } from 'oidc-client-ts';
import { initializeAuthService, getUserManager } from './authService';

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

  const [isConfigured, setIsConfigured] = useState(false)

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

  const handleUserSessionChanged = useCallback(async () => {
    // This is fired if user session changes (e.g., from another tab)
    try {
      const manager = getUserManager();
      const currentUser = await manager.getUser();
      if (currentUser && !currentUser.expired) {
        setUser(currentUser);
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    }
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
    let isMounted = true;
    let managerInstance: UserManager | null = null;

    const bootstrapAuth = async () => {
      try {
        managerInstance = await initializeAuthService();
        if (!isMounted) return;

        const currentUser = await managerInstance.getUser();
        if (currentUser && !currentUser.expired) {
          setUser(currentUser);
        } else {
          setUser(null);
        }

        managerInstance.events.addUserLoaded(handleUserLoaded);
        managerInstance.events.addUserUnloaded(handleUserUnloaded);
        managerInstance.events.addUserSignedOut(handleUserSignedOut);
        managerInstance.events.addAccessTokenExpired(handleAccessTokenExpired);
        managerInstance.events.addUserSessionChanged(handleUserSessionChanged);
        managerInstance.events.addSilentRenewError(handleAuthError);

        setIsConfigured(true);
      } catch (error) {
        console.error('Critical error bootstrapping authentication:', error);
        if (isMounted) {
          setAuthError(error instanceof Error ? error : new Error(String(error)));
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
      if (managerInstance) {
        managerInstance.events.addUserLoaded(handleUserLoaded);
        managerInstance.events.addUserUnloaded(handleUserUnloaded);
        managerInstance.events.addUserSignedOut(handleUserSignedOut);
        managerInstance.events.addAccessTokenExpired(handleAccessTokenExpired);
        managerInstance.events.addUserSessionChanged(handleUserSessionChanged);
        managerInstance.events.addSilentRenewError(handleAuthError);
      }
    };
  }, [handleUserLoaded, handleUserUnloaded, handleUserSignedOut, handleAccessTokenExpired, handleUserSessionChanged, handleAuthError]);

  const login = () => {
    if (!isConfigured) return;
    setIsLoadingAuth(true); // Indicate that a login flow is starting
    getUserManager().signinRedirect().catch(error => {
      console.error("Signin redirect failed:", error);
      setAuthError(error);
      setIsLoadingAuth(false); // Stop loading if redirect fails
    });
  };

  const logout = () => {
    if (!isConfigured) return;
    setIsLoadingAuth(true); // Indicate logout process
    getUserManager().signoutRedirect().catch(error => {
      console.error("Signout redirect failed:", error);
      setAuthError(error);
      setIsLoadingAuth(false); // Stop loading if redirect fails
    });
  };

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!isConfigured) return null;
    const currentUser = await getUserManager().getUser();
    if (currentUser && !currentUser.expired) {
      return currentUser.access_token;
    }
    return null;
  }, [isConfigured]);

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