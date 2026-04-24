"use client";

import { useEffect } from "react";
import { requestNotificationPermission, setupForegroundListener } from "@/utils/firebase";
import toast from "react-hot-toast";
import { useNotifications } from "@/context/NotificationContext";

export default function FCMHandler() {
  const { fetchNotifications } = useNotifications();

  useEffect(() => {
    // Request permission on mount
    setTimeout(() => requestNotificationPermission(), 2000);

    // Re-request on login
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token) setTimeout(() => requestNotificationPermission(), 500);
    };
    window.addEventListener('storage', handleStorageChange);

    // Persistent foreground listener — fires every time without refresh
    const unsubscribe = setupForegroundListener(async (payload: any) => {
      if (payload?.notification) {
        const { title, body } = payload.notification;
        toast.success(`${title}: ${body}`, { duration: 5000, position: 'top-center' });
        await fetchNotifications();
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchNotifications]);

  return null;
}
