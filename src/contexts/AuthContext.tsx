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
    // For demo purposes, simulate authentication after a short delay
    setTimeout(() => {
      setUser({
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@school.edu',
        picture: 'https://ui-avatars.com/api/?name=Demo+User&background=3B82F6&color=fff'
      });
      setIsLoading(false);
    }, 1500);
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
      // For demo purposes, simulate sign in
      setIsLoading(true);
      setTimeout(() => {
        setUser({
          id: 'demo-user',
          name: 'Demo User',
          email: 'demo@school.edu',
          picture: 'https://ui-avatars.com/api/?name=Demo+User&background=3B82F6&color=fff'
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const signOut = () => {
    setUser(null);
    // For demo purposes, just clear the user
    console.log('User signed out');
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
