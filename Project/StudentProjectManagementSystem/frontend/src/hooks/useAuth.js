'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_CREDENTIALS } from '@/utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('spms_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('spms_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const authUser = {
        id: 8,
        name: 'Admin User',
        email: DEMO_CREDENTIALS.email,
        type: 'Admin',
        department: 'Administration',
      };
      localStorage.setItem('spms_user', JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('spms_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
