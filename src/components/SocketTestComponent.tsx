'use client';

import { useEffect, useState } from 'react';

export function SocketTestComponent() {
  const [status, setStatus] = useState('Initializing...');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const userId = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('user') || '{}').id 
      : null;

    if (!userId) {
      setStatus('❌ No user ID found');
      return;
    }

    setStatus(`✅ User ID: ${userId}`);

    // Listen for socket notifications
    const handleNotification = (event: any) => {
      console.log('📬 Notification received:', event.detail);
      setNotifications(prev => [event.detail, ...prev].slice(0, 5));
      setStatus('✅ Notification received!');
    };

    window.addEventListener('new_notification', handleNotification);

    return () => {
      window.removeEventListener('new_notification', handleNotification);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🔌 Socket Test</h3>
      <p className="text-xs text-gray-600 mb-2">{status}</p>
      
      {notifications.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
          <p className="text-xs font-semibold text-green-700 mb-1">Recent Notifications:</p>
          {notifications.map((notif, idx) => (
            <div key={idx} className="text-xs text-gray-700 mb-1 pb-1 border-b border-green-100 last:border-0">
              <p className="font-semibold">{notif.title}</p>
              <p className="text-gray-600">{notif.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
