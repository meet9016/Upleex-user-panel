'use client';
import React from 'react';
import Link from 'next/link';
import { Package, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export const QuickActions: React.FC = () => {
  const { cartCount } = useCart();
  const router = useRouter();

  const handleOrdersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (token) {
      router.push('/orders');
    } else {
      // toast.error('Please login to view your orders', {
      //   icon: '🔒',
      //   duration: 3000,
      //   position: 'top-center',
      // });
      setTimeout(() => {
        router.push('/auth/login');
      }, 800);
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Orders Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={handleOrdersClick}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border-none outline-none"
          title="My Orders"
        >
          <Package size={24} className="group-hover:scale-110 transition-transform" />
        </button>
      </motion.div>

      {/* Cart Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Link
          href="/cart"
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="Shopping Cart"
        >
          <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>
      </motion.div>
    </div>
  );
};