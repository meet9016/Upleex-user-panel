'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NavigationButtons } from '@/components/features/NavigationButtons';
import { Bell, CheckCircle, Clock } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { toast } from 'react-hot-toast';
import { useNotifications } from '@/context/NotificationContext';

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const getRedirectPath = (notification: any): string => {
  const type = notification.type;
  const data = notification.data as any;
  // type field se redirect
  if (type === 'order_update') return '/orders';
  if (type === 'quote_update') return '/quotes';
  // fallback: data.type check
  if (data?.type === 'order_update') return '/orders';
  if (data?.type === 'quote_update') return '/quotes';
  // fallback: quoteId + complete = orders
  if (data?.quoteId && data?.status === 'complete') return '/orders';
  if (data?.quoteId) return '/quotes';
  if (data?.orderId) return '/orders';
  return '/quotes';
};

const renderBody = (body: string, isReject: boolean) => {
  // Match "for ProductName has" or "product ProductName is"
  const patterns = [
    /^(.*?for\s)([A-Za-z][^.!?]{2,50}?)(\s+has\b.*)$/,
    /^(.*?product\s)([A-Za-z][^.!?]{2,50}?)(\s+is\b.*)$/,
  ];
  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      return (
        <span>
          {match[1]}
          <strong className={isReject ? 'text-red-700' : 'text-gray-900'}>{match[2]}</strong>
          {match[3]}
        </span>
      );
    }
  }
  return <span>{body}</span>;
};

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, loading, markAllAsRead, markAsRead } = useNotifications();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleClick = async (notification: any) => {
    const id = notification._id || notification.id;
    await markAsRead(id);
    router.push(getRedirectPath(notification));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <NavigationButtons />

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">Updates on your orders and account</p>
              </div>
            </div>
            {notifications.some(n => !n.is_read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                const isReject = notification.title?.toLowerCase().includes('reject');
                return (
                  <div
                    key={notification._id || notification.id}
                    onClick={() => handleClick(notification)}
                    className={`px-8 py-5 transition-colors hover:bg-gray-50 flex gap-4 cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center ${
                      isReject ? 'bg-red-100 text-red-600' :
                      notification.type === 'order_update' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {notification.type === 'order_update' && !isReject
                        ? <CheckCircle className="w-5 h-5" />
                        : <Bell className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-bold text-sm ${
                          isReject ? 'text-red-600' : !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${isReject ? 'text-red-500' : 'text-gray-600'}`}>
                        {renderBody(notification.body, isReject)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No notifications yet</h3>
                <p className="text-gray-500">We'll notify you when something important happens.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
