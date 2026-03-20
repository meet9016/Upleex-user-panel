'use client';
import React from 'react';
import Link from 'next/link';
import { Package, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export const QuickActions: React.FC = () => {
  const { cartCount } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Orders Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/orders"
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="My Orders"
        >
          <Package size={24} className="group-hover:scale-110 transition-transform" />
        </Link>
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