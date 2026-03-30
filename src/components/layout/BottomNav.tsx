'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', count: wishlistCount },
    { icon: ShoppingCart, label: 'Cart', href: '/cart', count: cartCount },
    { icon: User, label: 'Account', href: '/profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 pt-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 ${
                isActive ? 'text-upleex-blue' : 'text-slate-400'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50' : ''}`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-3 bg-red-500 text-white text-[8px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold border border-white">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
