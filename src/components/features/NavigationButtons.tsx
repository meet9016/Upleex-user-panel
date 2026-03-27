'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, Package, FileText } from 'lucide-react';

export const NavigationButtons = () => {
  const router = useRouter();
  const pathname = usePathname();   // ← This helps detect current page

  const isActive = (path: string) => pathname === path;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* My Profile */}
      <button
        onClick={() => router.push('/profile')}
        className={`flex items-center gap-3 p-5 rounded-2xl border transition-all active:scale-[0.98] ${
          isActive('/profile')
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg'
        }`}
      >
        <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
          isActive('/profile') ? 'bg-blue-600' : 'bg-blue-100'
        }`}>
          <User className={`w-6 h-6 ${isActive('/profile') ? 'text-white' : 'text-blue-600'}`} />
        </div>
        <div className="text-left">
          <p className={`font-semibold ${isActive('/profile') ? 'text-blue-700' : 'text-gray-900'}`}>
            My Profile
          </p>
          <p className="text-sm text-gray-500">View & edit profile</p>
        </div>
      </button>

      {/* My Orders */}
      <button
        onClick={() => router.push('/orders')}
        className={`flex items-center gap-3 p-5 rounded-2xl border transition-all active:scale-[0.98] ${
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
        className={`flex items-center gap-3 p-5 rounded-2xl border transition-all active:scale-[0.98] ${
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
    </div>
  );
};