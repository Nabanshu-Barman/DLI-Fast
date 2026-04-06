'use client';

import { useState, useEffect } from 'react';

interface AuthUser {
  _id: string;
  role: string;
  name: string;
  srmRegNo: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('dli_jwt');
    if (!token) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUser(null);
      return;
    }

    try {
      // Decode JWT payload (base64) without verification — just to read the role
      const payload = JSON.parse(atob(token.split('.')[1])) as AuthUser;
      setUser(payload);
      setIsLoggedIn(true);
      setIsAdmin(payload.role === 'admin');
    } catch {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('dli_jwt');
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return { user, isLoggedIn, isAdmin, logout };
}
