import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  quickLoginAs: (role: 'admin' | 'customer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('shopsphere_auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.auth.getMe();
        if (res.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        localStorage.removeItem('shopsphere_auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.auth.login({ email, password });
      if (res.data?.user) {
        setUser(res.data.user);
        success(`Welcome back, ${res.data.user.name}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      error(err.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      const res = await api.auth.register({ name, email, password, confirmPassword });
      if (res.data?.user) {
        setUser(res.data.user);
        success('Account created successfully! Welcome to ShopSphere.');
        return true;
      }
      return false;
    } catch (err: any) {
      error(err.message || 'Registration failed.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network failures on logout
    } finally {
      localStorage.removeItem('shopsphere_auth_token');
      setUser(null);
      success('Logged out successfully.');
    }
  };

  const quickLoginAs = async (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      await login('admin@shopsphere.com', 'Admin@123');
    } else {
      await login('customer@shopsphere.com', 'Customer@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        quickLoginAs,
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
