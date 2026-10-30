'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Check customer session
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.user);
        } else {
          setUser(null);
        }
      }

      // Check admin session
      const adminRes = await fetch('/api/admin/auth/me');
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        if (adminData.success) {
          setAdmin(adminData.admin);
        } else {
          setAdmin(null);
        }
      }
    } catch (e) {
      console.warn('Auth check error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error || 'Login failed' };
  };

  const register = async (formData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error || 'Registration failed' };
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const adminLogin = async (email, password) => {
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setAdmin(data.admin);
      return { success: true };
    }
    return { success: false, error: data.error || 'Invalid credentials' };
  };

  const adminLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        login,
        register,
        logout,
        adminLogin,
        adminLogout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
