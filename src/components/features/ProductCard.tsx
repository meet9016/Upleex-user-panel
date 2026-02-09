'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Heart } from 'lucide-react';
import type { Product } from '../../types';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product | any;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const productId = product.product_id || product.id;
  const productName = product.product_name || product.title;
  const productImage = product.product_main_image;
  const productPrice = product.price || product.pricePerMonth;
  const cancelPrice =
    product.cancel_price ||
    (product.pricePerMonth ? Math.round(product.pricePerMonth * 1.2) : null);
  const productCategory = product.sub_category_name || product.category;
  const productLocation = product.location || 'Surat';

  return (
    <motion.div
      onClick={() => router.push(`/browse-ads/${productId}`)}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}
      whileHover={{ boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden">
        <motion.img
          src={
            productImage ||
            'https://upleex.2min.cloud/upload/product_main_images/2026/01/2026-01-29/ce145a2a7c6ba13df4baceb3ac7843fd.jpg'
          }
          alt={productName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* Dark Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition"
          initial={{ opacity: 0.1 }}
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.4 }}
        />

        {/* Wishlist Heart */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          whileTap={{ scale: 0.85 }}
          animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{
            duration: 0.35,
            ease: 'easeOut',
          }}
          className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow hover:shadow-md"
        >
          {liked && (
            <motion.span
              className="absolute inset-0 rounded-full bg-red-400/30"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}

          <Heart
            size={18}
            className={`relative transition-colors ${liked ? 'text-red-500' : 'text-slate-500'
              }`}
            fill={liked ? '#ef4444' : 'none'}
          />
        </motion.button>


        {/* Category */}
        {productCategory && (
          <span className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">
            {productCategory}
          </span>
        )}

        {/* Price */}
        <div className="absolute bottom-3 right-3 z-10 bg-gradient-to-r from-upleex-blue to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
          ₹{Number(productPrice || 0).toLocaleString()}/ {product?.product_listing_type_name}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-slate-800 line-clamp-1 hover:text-upleex-blue transition">
          {productName}
        </h3>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin size={14} className="mr-1" />
          {productLocation}
        </div>

        {cancelPrice && (
          <div className="text-xs text-gray-400 line-through">
            ₹{cancelPrice}/Month
          </div>
        )}

        <Button
          fullWidth
          variant="primary"
          className="mt-3 rounded-xl font-semibold tracking-wide cursor-pointer"
        >
          Take On Rent
        </Button>
      </div>
    </motion.div>
  );
};
