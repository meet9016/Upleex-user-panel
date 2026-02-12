'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, ShoppingBag, MapPin, LogOut } from 'lucide-react';

export const ProfileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        if (userStr.startsWith('{') || userStr.startsWith('[')) {
          const userData = JSON.parse(userStr);
          setUserName(userData.full_name || userData.name || 'User');
        } else {
          setUserName(userStr);
        }
      } catch (e) {
        setUserName('User');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  const menuItems = [
    { icon: User, label: 'My Profile', href: '/profile' },
    { icon: ShoppingBag, label: 'My Orders', href: '/orders' },
    { icon: MapPin, label: 'Saved Addresses', href: '/addresses' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 bg-white border-b border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-upleex-blue flex items-center justify-center font-bold text-xl">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-xs text-gray-500">Hello,</div>
          <div className="font-bold text-gray-900">{userName}</div>
        </div>
      </div>
      
      <div className="p-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                isActive 
                  ? 'bg-blue-50 text-upleex-blue font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <div className="h-px bg-gray-100 my-2 mx-4"></div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
