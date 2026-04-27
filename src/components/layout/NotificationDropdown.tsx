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
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

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
    window.addEventListener('new_notification', handleNewNotif);
    return () => window.removeEventListener('new_notification', handleNewNotif);
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
          className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Notifications</p>
                {unreadCount > 0 && <p className="text-xs text-gray-500">{unreadCount} unread</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={16} />
              </button>
            </div>
          </div>

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
                    className={`px-5 py-3.5 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/40' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                      isReject ? 'bg-red-100 text-red-600' :
                      notif.type === 'order_update' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        title={notif.title}
                        className={`text-sm font-semibold truncate ${isReject ? 'text-red-600' : !notif.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notif.title}
                      </p>
                      <p 
                        title={notif.body?.replace(/<[^>]*>?/gm, '')}
                        className={`text-xs mt-0.5 line-clamp-2 ${isReject ? 'text-red-500' : 'text-gray-500'}`}>{bodyEl}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{formatDate(notif.createdAt)}</p>
                    </div>
                    {!notif.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100">
              <button
                onClick={() => { setIsOpen(false); router.push('/profile/notifications'); }}
                className="w-full text-center text-sm font-semibold text-upleex-blue hover:text-upleex-purple transition-colors cursor-pointer"
              >
                View all notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
