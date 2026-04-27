'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import useSocket from '@/hooks/useSocket';

const SocketHandler = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const loadUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserId(undefined);
        return;
      }
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        if (typeof parsedUser === 'object' && parsedUser !== null) {
          const id = parsedUser._id || parsedUser.id;
          console.log('[SocketHandler] userId loaded:', id);
          setUserId(id);
          return;
        }
      }
      setUserId(undefined);
    } catch (e) {
      setUserId(undefined);
    }
  };

  useEffect(() => {
    loadUserId();
    // Re-load on login/logout
    window.addEventListener('storage', loadUserId);
    return () => window.removeEventListener('storage', loadUserId);
  }, []);

  const { socket, isConnected } = useSocket(userId, 'user');
  const socketRef = useRef(socket);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  const handleNotification = useCallback((notification: any) => {
    console.log('[SocketHandler] 🔔 new_notification received:', notification);
    window.dispatchEvent(new CustomEvent('new_notification', { detail: notification }));
  }, []);

  useEffect(() => {
    if (!socket || !isConnected || !userId) return;
    console.log('[SocketHandler] ✅ Attaching listener for user:', userId);
    socket.on('new_notification', handleNotification);
    return () => { socket.off('new_notification', handleNotification); };
  }, [socket, isConnected, userId, handleNotification]);

  return null;
};

export default SocketHandler;
