'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/axiosInstance';

interface UserNotification {
  _id: string;
  id?: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  createdAt: string;
  data?: any;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const getRedirectPath = (notif: UserNotification): string => {
  const type = notif.type;
  const data = notif.data || {};
  if (type === 'order_update') return '/orders';
  if (type === 'quote_update') return '/quotes';
  if (data?.quoteId && data?.status === 'complete') return '/orders';
  if (data?.quoteId) return '/quotes';
  if (data?.orderId) return '/orders';
  return '/quotes';
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const fetchNotifications = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const res = await api.get('notifications');
      if (res.data.success) setNotifications(res.data.data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    if (!id) return;
    setNotifications(prev =>
      prev.map(n => (n._id === id || n.id === id ? { ...n, is_read: true } : n))
    );
    await api.put(`notifications/${id}/read`).catch(() => {});
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await api.put('notifications/read-all').catch(() => {});
    window.dispatchEvent(new CustomEvent('notifications_read_all'));
  }, []);

  // Fetch on mount and listen for socket/FCM events
  useEffect(() => {
    fetchNotifications();
    const handleNewNotif = (e: any) => {
      console.log('[NotificationDropdown] window event new_notification fired:', e.detail);
      const notif = e.detail;
      if (notif && (notif._id || notif.id)) {
        // Instantly add to top of list without waiting for DB fetch
        setNotifications(prev => {
          const id = notif._id || notif.id;
          const exists = prev.some(n => (n._id || n.id) === String(id));
          if (exists) return prev;
          return [{ ...notif, _id: String(id), is_read: false }, ...prev];
        });
      }
      fetchNotifications();
    };
    const handleAllRead = () => fetchNotifications();
    window.addEventListener('new_notification', handleNewNotif);
    window.addEventListener('notifications_read_all', handleAllRead);
    // On socket reconnect, fetch missed notifications from DB
    window.addEventListener('socket_reconnected', fetchNotifications);
    return () => {
      window.removeEventListener('new_notification', handleNewNotif);
      window.removeEventListener('notifications_read_all', handleAllRead);
      window.removeEventListener('socket_reconnected', fetchNotifications);
    };
  }, [fetchNotifications]);

  // Refresh on open
  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotifClick = async (notif: UserNotification) => {
    const id = notif._id || notif.id!;
    await markAsRead(id);
    setIsOpen(false);
    router.push(getRedirectPath(notif));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={24} className="text-slate-700 group-hover:text-upleex-blue transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-full mt-3 w-[340px] max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden z-50"
          style={{ right: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#6366f1] to-[#0ea5e9]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-[#6366f1] bg-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {notificationPermission !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="text-xs font-medium text-[#6366f1] hover:text-[#4f46e5] cursor-pointer bg-white px-2 py-1 rounded shadow-sm transition-colors"
                >
                  {notificationPermission === 'denied' ? 'Enable Notifications' : 'Allow Notifications'}
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Permission denied message */}
          {notificationPermission === 'denied' && (
            <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-100">
              <p className="text-xs text-yellow-800">
                Notifications are blocked. Please enable them in your browser settings to receive real-time updates.
              </p>
            </div>
          )}

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {loading && notifications.length === 0 ? (
              <div className="py-12 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 10).map(notif => {
                const isReject = notif.title?.toLowerCase().includes('reject');
                const notifId = notif._id || notif.id;
                const bodyEl = <span dangerouslySetInnerHTML={{ __html: notif.body }} />;
                return (
                  <div
                    key={notifId}
                    onClick={() => handleNotifClick(notif)}
                    className={`px-5 py-3.5 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer group relative ${!notif.is_read ? 'bg-blue-50/40' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                      isReject ? 'bg-red-100 text-red-600' :
                      notif.type === 'order_update' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p 
                          title={notif.title}
                          className={`text-sm font-semibold truncate pr-4 ${isReject ? 'text-red-600' : !notif.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                          {formatDate(notif.createdAt).split(' ')[0]}
                        </span>
                      </div>
                      <p 
                        title={notif.body?.replace(/<[^>]*>?/gm, '')}
                        className={`text-xs mt-0.5 line-clamp-2 pr-6 ${isReject ? 'text-red-500' : 'text-gray-500'}`}>{bodyEl}</p>
                    </div>
                    {!notif.is_read && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full group-hover:opacity-0 transition-opacity" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col border-t border-gray-100 bg-gray-50">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="w-full px-4 py-3 text-sm bg-gradient-to-r from-[#6366f1] to-[#0ea5e9] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Mark all as read ({unreadCount})
              </button>
            )}
            <button
              onClick={() => { setIsOpen(false); router.push('/profile/notifications'); }}
              className="w-full text-center text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer py-2 hover:bg-gray-100"
            >
              View all notifications
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
