import { useCallback, useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {

  const [authState, setAuthState] = useState(() => {
    const savedToken = localStorage.getItem('authToken');
    return {
      user: null,
      token: savedToken || null,
      isLoading: false, 
      error: null,
    };
  });

  // log user in
  const login = useCallback((token, userData) => {
    localStorage.setItem('authToken', token);
    setAuthState((prev) => ({
      ...prev,
      token,
      user: userData,
      error: null,
    }));
  }, []);

  // log user out
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setAuthState((prev) => ({
      ...prev,
      token: null,
      user: null,
      error: null,
    }));
  }, []);

  // set errors
  const setAuthError = useCallback((err) => {
    setAuthState((prev) => ({
      ...prev,
      error: err,
    }));
  }, []);

  // Combine authState with methods
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