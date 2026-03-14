import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.authenticated && sessionData.username) {
          setIsAuthenticated(true);
          setUser(sessionData.username);
        }
      } catch (error) {
        console.error('Failed to parse session:', error);
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Get credentials from environment variables
    const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    // Verify username
    if (username !== envUsername) {
      return false;
    }

    // Verify password
    if (password !== envPassword) {
      return false;
    }

    // Create session token
    const sessionData = {
      authenticated: true,
      username: username,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('admin_session', JSON.stringify(sessionData));
      setIsAuthenticated(true);
      setUser(username);
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
