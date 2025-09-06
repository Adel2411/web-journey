import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIXED: Properly verify token with backend on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          console.log('Found token, verifying with backend...');
          
          // CRITICAL FIX: Verify token with backend instead of creating fake user
          const response = await authAPI.verifyToken();
          
          if (response.success && response.data && response.data.user) {
            console.log('Token verified successfully');
            // Use REAL user data from backend
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            console.log('Token verification failed, clearing storage');
            // Token is invalid, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('rememberMe');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('No token found in localStorage');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.log('Auth initialization error:', error.message);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('rememberMe');
        setIsAuthenticated(false);
        setUser(null);
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store token and auto-login user after registration
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, user };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear all stored data first
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      
      // Clear state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      // Optional: Call logout endpoint to invalidate token on server
      try {
        await authAPI.logout();
      } catch {
        console.log('Server logout failed, but local logout successful');
      }
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // FIXED: Proper token refresh with backend verification
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        return false;
      }

      const response = await authAPI.verifyToken();
      if (response.success && response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  // Update user data (for profile updates)
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Check if user has specific permissions (bonus feature)
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Enhanced session management with periodic token verification
  useEffect(() => {
    let verifyInterval;
    
    if (isAuthenticated) {
      // Verify token every 5 minutes to catch expired tokens early
      verifyInterval = setInterval(async () => {
        console.log('Performing periodic token verification...');
        const isValid = await refreshToken();
        if (!isValid) {
          setError('Your session has expired. Please login again.');
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
    
    return () => {
      if (verifyInterval) {
        clearInterval(verifyInterval);
      }
    };
  }, [isAuthenticated]);

  // Online/offline status handling
  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online, verifying token...');
      if (isAuthenticated) {
        // Verify token is still valid when coming back online
        refreshToken();
      }
      // Clear offline error
      if (error && error.includes('offline')) {
        setError(null);
      }
    };

    const handleOffline = () => {
      console.log('Gone offline');
      setError('You are currently offline. Some features may not work.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated, error]);

  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,
    refreshToken,
    hasPermission,
    
    // Utility
    isOnline: navigator.onLine,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};