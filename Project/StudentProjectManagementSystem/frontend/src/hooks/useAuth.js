'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '@/services/api';

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
        localStorage.removeItem('spms_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await authService.login(email, password);

      localStorage.setItem('spms_token', data.token);

      const authUser = {
        id: data.userId,
        name: data.fullName,
        email: data.email,
        type: data.userType,
        roles: data.roles || [],
        profilePicturePath: data.profilePicturePath || '',
      };

      localStorage.setItem('spms_user', JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid credentials' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('spms_user');
    localStorage.removeItem('spms_token');
    setUser(null);
  }, []);

  const roleFlags = useMemo(() => {
    if (!user) return { isAdmin: false, isFaculty: false, isStudent: false, role: 'Guest' };

    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    const isAdmin = userRoles.includes('Admin') || user.type === 'Admin';
    const isFaculty = userRoles.includes('Faculty') || user.type === 'Faculty';
    const isStudent = userRoles.includes('Student') || user.type === 'Student';

    const role = isAdmin ? 'Admin' : isFaculty ? 'Faculty' : isStudent ? 'Student' : (user.type || 'User');

    return { isAdmin, isFaculty, isStudent, role };
  }, [user]);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('spms_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        ...roleFlags,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
