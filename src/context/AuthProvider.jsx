import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken || null,
      isLoading: true,
      error: null,
    };
  });

  // token and user from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('authUser');
      
      if (token && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setAuthState((prev) => ({
            ...prev,
            user,
            token,
            isLoading: false,
          }));
        } catch {
          // Corrupted data, clear
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    initAuth();
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setAuthState((prev) => ({
      ...prev,
      token,
      user: userData,
      error: null,
    }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthState((prev) => ({
      ...prev,
      token: null,
      user: null,
      error: null,
    }));
  }, []);

  const setAuthError = useCallback((err) => {
    setAuthState((prev) => ({
      ...prev,
      error: err,
    }));
  }, []);

  const value = {
    ...authState,
    isAuthenticated: !!authState.token,
    login,
    logout,
    setAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}