'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { api } from '@/utils/axiosInstance';

interface Notification {
  _id: string;
  id?: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  createdAt: string;
  data?: object;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, '_id' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    if (!id || id.startsWith('temp-')) return;
    setNotifications(prev => prev.map(n => {
      const nId = n._id || (n as any).id;
      return nId === id ? { ...n, _id: id, is_read: true } : n;
    }));
    await api.put(`/notifications/${id}/read`).catch(() => {});
  }, []);

  const markAllAsRead = useCallback(async () => {
    await api.put('/notifications/read-all').catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, '_id' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...notification,
      _id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  useEffect(() => {
    // Sirf ek baar fetch karo mount pe
    const token = localStorage.getItem('token');
    if (token) fetchNotifications();

    // Login/logout pe re-fetch
    const handleStorage = () => {
      const t = localStorage.getItem('token');
      if (t) fetchNotifications();
      else setNotifications([]);
    };
    window.addEventListener('storage', handleStorage);

    // Poll every 30 seconds
    const pollInterval = setInterval(() => {
      const t = localStorage.getItem('token');
      if (t) fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorage);
    };
  }, []); // empty dependency — sirf mount pe

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, isOpen, setIsOpen, fetchNotifications, markAllAsRead, markAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

