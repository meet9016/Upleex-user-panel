"use client";

import { useEffect } from "react";
import { requestNotificationPermission, onMessageListener } from "@/utils/firebase";
import toast from "react-hot-toast";
import { useNotifications } from "@/context/NotificationContext";

export default function FCMHandler() {
  const { fetchNotifications } = useNotifications();

  useEffect(() => {
    // Request permission on mount
    setTimeout(() => requestNotificationPermission(), 2000);

    // Re-request on login/storage change (when token is set)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setTimeout(() => requestNotificationPermission(), 500);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const listenForMessages = async () => {
      try {
        const payload: any = await onMessageListener();
        if (payload?.notification) {
          const { title, body } = payload.notification;
          toast.success(`${title}: ${body}`, { duration: 5000, position: 'top-center' });
          await fetchNotifications();
        }
      } catch (err) {
        console.error('FCM listener error:', err);
      }
      listenForMessages();
    };

    listenForMessages();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchNotifications]);

  return null;
}
