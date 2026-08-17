'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_CREDENTIALS } from '@/utils/constants';
import { userService } from '@/services/api';

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
    } else {
      // Set default authenticated user if none is stored
      const defaultUser = {
        id: 1,
        name: 'Admin User',
        email: DEMO_CREDENTIALS.email,
        type: 'Admin',
        department: 'Administration',
      };
      localStorage.setItem('spms_user', JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    // 1. Check Demo Credentials
    if (
      (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) ||
      (email?.toLowerCase() === 'admin@spms.edu' && password === 'admin123')
    ) {
      const authUser = {
        id: 1,
        name: 'Admin User',
        email: email,
        type: 'Admin',
        department: 'Administration',
      };
      localStorage.setItem('spms_user', JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    }

    // 2. Check against live backend users if available
    try {
      const users = await userService.getAll();
      const matched = users?.find(
        (u) => u.email?.toLowerCase() === email?.toLowerCase().trim() && !u.isDeleted
      );

      if (matched) {
        const authUser = {
          id: matched.userId,
          name: matched.fullName,
          email: matched.email,
          type: matched.userTypeId === 1 ? 'Student' : matched.userTypeId === 2 ? 'Faculty' : 'Admin',
          department: 'Academic Department',
        };
        localStorage.setItem('spms_user', JSON.stringify(authUser));
        setUser(authUser);
        return { success: true };
      }
    } catch {
      // Fallback
    }

    // 3. Permissive fallback for testing if non-empty
    if (email && password) {
      const authUser = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        type: 'Admin',
        department: 'Administration',
      };
      localStorage.setItem('spms_user', JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    }

    return { success: false, error: 'Please enter a valid email and password' };
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
