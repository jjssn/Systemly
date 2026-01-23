'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers, User } from '@/lib/mock-data';

type AuthContextType = {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('currentUserEmail');
    if (storedEmail) {
      const user = mockUsers.find(u => u.email === storedEmail);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, []);

  const login = (email: string): boolean => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserEmail', email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserEmail');
  };

  // Admin check - for demo purposes, IT department users are admins
  const isAdmin = currentUser?.department === 'IT' || false;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
