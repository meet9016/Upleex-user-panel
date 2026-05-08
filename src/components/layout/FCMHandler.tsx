"use client";

import { useEffect } from "react";
import { requestNotificationPermission, setupForegroundListener } from "@/utils/firebase";
import toast from "react-hot-toast";

export default function FCMHandler() {
  useEffect(() => {
    // iOS Safari doesn't support Notifications/Service Workers - skip
    if (typeof window === 'undefined' || !('Notification' in window)) return;

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
        // Dispatch window event so NotificationDropdown can refresh
        window.dispatchEvent(new CustomEvent('new_notification', { detail: payload.notification }));
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return null;
}
