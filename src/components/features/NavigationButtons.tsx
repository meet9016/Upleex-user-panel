'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, Package, FileText, LayoutDashboard, Bell } from 'lucide-react';
import { api } from '@/utils/axiosInstance';

export const NavigationButtons = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    try {
      const res = await api.get('notifications');
      if (res.data.success) {
        const count = (res.data.data as any[]).filter((n: any) => !n.is_read).length;
        setUnreadCount(count);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const handleNewNotif = () => fetchUnreadCount();
    window.addEventListener('new_notification', handleNewNotif);
    return () => window.removeEventListener('new_notification', handleNewNotif);
  }, [fetchUnreadCount]);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-5 gap-4 mb-8">
      {/* Dashboard */}
      <button
        onClick={() => router.push('/profile')}
        className={`flex items-center cursor-pointer gap-3 p-5 rounded-2xl border transition-all active:scale-[0.98] ${
          isActive('/profile')
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg'
        }`}
      >
        <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
          isActive('/profile') ? 'bg-blue-600' : 'bg-blue-100'
        }`}>
          <LayoutDashboard className={`w-6 h-6 ${isActive('/profile') ? 'text-white' : 'text-blue-600'}`} />
        </div>
        <div className="text-left">
          <p className={`font-semibold ${isActive('/profile') ? 'text-blue-700' : 'text-gray-900'}`}>
            Dashboard
          </p>
          <p className="text-sm text-gray-500">View rentals &amp; orders</p>
        </div>
      </button>

      {/* My Profile */}
      <button
        onClick={() => router.push('/profile/edit')}
        className={`flex items-center gap-3 cursor-pointer p-5 rounded-2xl border transition-all active:scale-[0.98] ${
          isActive('/profile/edit')
            ? 'border-orange-500 bg-orange-50 shadow-md'
            : 'bg-white border-gray-200 hover:border-orange-500 hover:shadow-lg'
        }`}
      >
        <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
          isActive('/profile/edit') ? 'bg-orange-600' : 'bg-orange-100'
        }`}>
          <User className={`w-6 h-6 ${isActive('/profile/edit') ? 'text-white' : 'text-orange-600'}`} />
        </div>
        <div className="text-left">
          <p className={`font-semibold ${isActive('/profile/edit') ? 'text-orange-700' : 'text-gray-900'}`}>
            My Profile
          </p>
          <p className="text-sm text-gray-500">View &amp; edit profile</p>
        </div>
      </button>

      {/* My Orders */}
      <button
        onClick={() => router.push('/orders')}
        className={`flex items-center gap-3 cursor-pointer p-5 rounded-2xl border transition-all active:scale-[0.98] ${
          isActive('/orders')
            ? 'border-green-500 bg-green-50 shadow-md'
            : 'bg-white border-gray-200 hover:border-green-500 hover:shadow-lg'
        }`}
      >
        <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
          isActive('/orders') ? 'bg-green-600' : 'bg-green-100'
        }`}>
          <Package className={`w-6 h-6 ${isActive('/orders') ? 'text-white' : 'text-green-600'}`} />
        </div>
        <div className="text-left">
          <p className={`font-semibold ${isActive('/orders') ? 'text-green-700' : 'text-gray-900'}`}>
            My Orders
          </p>
          <p className="text-sm text-gray-500">Track your orders</p>
        </div>
      </button>

      {/* My Quotes */}
      <button
        onClick={() => router.push('/quotes')}
        className={`flex items-center gap-3 cursor-pointer p-5 rounded-2xl border transition-all active:scale-[0.98] ${
          isActive('/quotes')
            ? 'border-purple-500 bg-purple-50 shadow-md'
            : 'bg-white border-gray-200 hover:border-purple-500 hover:shadow-lg'
        }`}
      >
        <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
          isActive('/quotes') ? 'bg-purple-600' : 'bg-purple-100'
        }`}>
          <FileText className={`w-6 h-6 ${isActive('/quotes') ? 'text-white' : 'text-purple-600'}`} />
        </div>
        <div className="text-left">
          <p className={`font-semibold ${isActive('/quotes') ? 'text-purple-700' : 'text-gray-900'}`}>
            My Quotes
          </p>
          <p className="text-sm text-gray-500">View your quotes</p>
        </div>
      </button>

      {/* Notifications */}
      <button
        onClick={() => router.push('/profile/notifications')}
        className={`flex items-center gap-3 cursor-pointer p-5 rounded-2xl border transition-all active:scale-[0.98] ${
          isActive('/profile/notifications')
            ? 'border-red-500 bg-red-50 shadow-md'
            : 'bg-white border-gray-200 hover:border-red-500 hover:shadow-lg'
        }`}
      >
        <div className={`relative w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
          isActive('/profile/notifications') ? 'bg-red-600' : 'bg-red-100'
        }`}>
          <Bell className={`w-6 h-6 ${isActive('/profile/notifications') ? 'text-white' : 'text-red-600'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <div className="text-left">
          <p className={`font-semibold ${isActive('/profile/notifications') ? 'text-red-700' : 'text-gray-900'}`}>
            Notifications
          </p>
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread` : 'View updates'}
          </p>
        </div>
      </button>
    </div>
  );
};
