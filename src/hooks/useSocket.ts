'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
console.log('socket url',SOCKET_URL)

export const useSocket = (userId: string | undefined, type: 'user' | 'vendor' | 'admin' = 'user') => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
        setIsConnected(false);
      }
      return;
    }

    let active = true; // Strict Mode guard

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log(`[useSocket] Connecting for ${type} ${userId}`);
    const socket = io(SOCKET_URL, {
       path : '/api/api/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      withCredentials: true,
    });
    console.log('[useSocket] Socket instance created:', socket);

    socketRef.current = socket;

    const emitJoin = () => {
      socket.emit('join', { id: userId, type });
      console.log(`[useSocket] Emitted join for ${type} ${userId}`);
    };

    socket.on('connect', () => {
      if (!active) return;
      console.log(`[useSocket] ${type} connected, socketId:`, socket.id, '| userId:', userId);
      setIsConnected(true);
      setSocketInstance(socket);
      emitJoin();
    });

    socket.on('reconnect', (attempt: number) => {
      if (!active) return;
      console.log(`[useSocket] ${type} reconnected after ${attempt} attempts`);
      emitJoin();
    });

    socket.on('connect_error', (error: any) => {
      console.error(`[useSocket] ${type} connection error:`, error.message);
    });

    socket.on('disconnect', (reason: string) => {
      if (!active) return;
      console.log(`[useSocket] ${type} disconnected, reason:`, reason);
      setIsConnected(false);
      setSocketInstance(null);
    });

    return () => {
      active = false; // Prevent state updates after cleanup
      console.log(`[useSocket] Cleanup — disconnecting ${type} ${userId}`);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, type]);

  const emit = (event: string, data: any) => socketRef.current?.emit(event, data);
  const on = (event: string, cb: (...args: any[]) => void) => socketRef.current?.on(event, cb);
  const off = (event: string, cb?: (...args: any[]) => void) => socketRef.current?.off(event, cb);

  return { socket: socketInstance, isConnected, on, off, emit };
};

export default useSocket;
