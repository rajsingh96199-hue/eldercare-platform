import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  fastDemoLogin: (role: 'family' | 'caregiver' | 'admin') => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  isFamily: boolean;
  isCaregiver: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eldercare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('eldercare_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('eldercare_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('eldercare_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session validation error:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('eldercare_token', res.data.token);
        localStorage.setItem('eldercare_user', JSON.stringify(res.data.user));
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('eldercare_token', res.data.token);
        localStorage.setItem('eldercare_user', JSON.stringify(res.data.user));
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  const fastDemoLogin = async (demoRole: 'family' | 'caregiver' | 'admin'): Promise<boolean> => {
    let email = 'family@eldercare.com';
    if (demoRole === 'caregiver') email = 'nurse.sarah@eldercare.com';
    if (demoRole === 'admin') email = 'admin@eldercare.com';

    return await login(email, 'Password123!');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eldercare_token');
    localStorage.removeItem('eldercare_user');
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('eldercare_user', JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const merged = { ...user, ...updatedUser };
      setUser(merged as User);
      localStorage.setItem('eldercare_user', JSON.stringify(merged));
    }
  };

  const isFamily = user?.role === 'FAMILY';
  const isCaregiver = user?.role === 'CAREGIVER';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        fastDemoLogin,
        refreshProfile,
        updateUser,
        isFamily,
        isCaregiver,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
