import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('interviewai_token') || null);
  const [loading, setLoading] = useState(true);

  // Startup authentication verification
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('interviewai_token');
      if (storedToken) {
        try {
          const res = await getCurrentUser();
          if (res && res.success && res.data?.user) {
            setUser(res.data.user);
            setToken(storedToken);
          } else {
            clearAuthData();
          }
        } catch (error) {
          console.warn('Authentication token verification failed:', error.message);
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('interviewai_token');
    localStorage.removeItem('interviewai_user');
    setUser(null);
    setToken(null);
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('interviewai_user', JSON.stringify(updatedUser));
  };

  const handleRegister = async (userData) => {
    try {
      const response = await registerUser(userData);
      if (response && response.success && response.data) {
        const { user: newUser, token: newToken } = response.data;
        localStorage.setItem('interviewai_token', newToken);
        localStorage.setItem('interviewai_user', JSON.stringify(newUser));
        setUser(newUser);
        setToken(newToken);
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      };
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      if (response && response.success && response.data) {
        const { user: loggedInUser, token: newToken } = response.data;
        localStorage.setItem('interviewai_token', newToken);
        localStorage.setItem('interviewai_user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setToken(newToken);
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuthData();
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    updateUserData,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
