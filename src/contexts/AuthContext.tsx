import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // In real implementation, this would call your Google Apps Script endpoint
      // to check if the user is authenticated
      const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL/auth/check', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      // Redirect to Google Apps Script authentication endpoint
      window.location.href = 'YOUR_GOOGLE_APPS_SCRIPT_URL/auth/signin';
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const signOut = () => {
    setUser(null);
    // Clear any stored tokens and redirect to sign out endpoint
    window.location.href = 'YOUR_GOOGLE_APPS_SCRIPT_URL/auth/signout';
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}