'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '@/types';
import { authService, store, notificationService } from '@/services';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  postLoginRedirect: string | null;
  setPostLoginRedirect: (path: string | null) => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; demoOtp: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; user: Profile }>;
  logout: () => void;
  loginAsDemo: (role: 'user' | 'admin') => void;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  unreadNotificationCount: number;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocationState] = useState<string>('All Locations');
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);

  const refreshUserData = () => {
    const currentUser = store.getCurrentUser();
    setUser(currentUser);
    setSelectedLocationState(store.getSelectedLocation());
    if (currentUser) {
      const notifs = store.getNotifications(currentUser.id);
      setUnreadNotificationCount(notifs.filter((n) => !n.read).length);
    } else {
      setUnreadNotificationCount(0);
    }
  };

  useEffect(() => {
    refreshUserData();
    setIsLoading(false);

    const handleStoreUpdate = () => {
      refreshUserData();
    };

    window.addEventListener('drivetogether_store_update', handleStoreUpdate);
    return () => {
      window.removeEventListener('drivetogether_store_update', handleStoreUpdate);
    };
  }, []);

  const sendOtp = async (phone: string) => {
    return authService.sendOtp(phone);
  };

  const verifyOtp = async (phone: string, otp: string) => {
    const result = await authService.verifyOtp(phone, otp);
    setUser(result.user);
    refreshUserData();
    return result;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    refreshUserData();
    return updated;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    refreshUserData();
  };

  const loginAsDemo = (role: 'user' | 'admin') => {
    const profile = authService.loginAs(role);
    setUser(profile);
    refreshUserData();
  };

  const setSelectedLocation = (loc: string) => {
    setSelectedLocationState(loc);
    store.setSelectedLocation(loc);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginModalOpen,
        setLoginModalOpen,
        postLoginRedirect,
        setPostLoginRedirect,
        sendOtp,
        verifyOtp,
        updateProfile,
        logout,
        loginAsDemo,
        selectedLocation,
        setSelectedLocation,
        unreadNotificationCount,
        refreshUserData,
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
