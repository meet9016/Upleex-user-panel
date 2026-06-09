'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Heart } from 'lucide-react';
import { GoVerified } from 'react-icons/go';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Product } from '../../types';
import { AuthModal } from './AuthModal';
import { createSlug } from '@/utils/helper';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useWishlistRedux } from '@/redux/useWishlistRedux';

interface ProductCardProps {
  product: Product | any;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const router = useRouter();
  const productId = product.product_id || product.id || product._id;
  const { toggleWishlist, isInWishlist } = useWishlistRedux();
  const [localLiked, setLocalLiked] = useState<boolean | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isOutOfStock = product.is_out_of_stock || (product.available_quantity !== undefined && product.available_quantity <= 0);

  // Determine current wishlist status: local state > context > initial product data
  const isWishlisted = localLiked !== null ? localLiked : (productId ? isInWishlist(productId) : !!product.is_wishlist);
  const productName = product.product_name || product.title;
  const productImage = product.product_main_image;
  const listingType = (product?.product_type_name || product?.product_listing_type_name)?.toLowerCase();

  const isMonthly =
    product?.product_listing_type_name?.toLowerCase() === "monthly";

  let productPrice = product.price || product.pricePerMonth;
  let cancelPrice =
    product.cancel_price ||
    (product.pricePerMonth ? Math.round(product.pricePerMonth * 1.2) : null);

  if (isMonthly && Array.isArray(product.month_arr) && product.month_arr.length > 0) {
    const firstMonth = product.month_arr[0];

    productPrice = Number(firstMonth.price);
    cancelPrice = Number(firstMonth.cancel_price);
  }
  const productCategory = product.sub_category_name || product.category;
  const productLocation = product.vendor?.vendor_city_name || 'Surat';

  const sanitizeUrl = (url: string) => {
    if (!url) return '';
    return url.replace(/\s*\)\s*$/, '').trim();
  };

  // Separate function for handling card click
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on wishlist button
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    if (productId) {
      const urlSlug = product.slug || createSlug(productName);
      const subCatSlug = product.sub_category_slug || createSlug(product.sub_category_name || 'subcategory');
      router.push(`/${subCatSlug}/${urlSlug}`);
    }
  };

  // Handle wishlist click separately
  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to parent

    if (productId) {
      const newStatus = !isWishlisted;
      setLocalLiked(newStatus);
      
      const success = await toggleWishlist(productId, () => {
        setIsAuthModalOpen(true);
        setLocalLiked(null); // Reset on failure/auth required
      });
      
      if (!success) {
        setLocalLiked(null); // Reset if toggle failed
      }
    }
  };
   const getListingTypeLabel = () => {
    const type = product?.product_listing_type_name || product?.product_type_name;
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        className={`group relative w-full h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ${productId ? 'cursor-pointer' : 'cursor-default'} ${className}`}
        whileHover={{ boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* IMAGE */}
        <div className="relative h-44 md:h-52 overflow-hidden bg-gray-50/50">
          {/* Out of Stock Badge - Top Center */}
          {isOutOfStock  && (
            <div className="absolute top-2 md:top-3 left-1/2 transform -translate-x-1/2 z-30">
              <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-md">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Rent/Sell Tag */}
          {listingType && (
            <div className="absolute top-0 left-0 z-20 overflow-hidden w-20 h-20 md:w-24 md:h-24">
              <span
                className={cn(
                  "absolute -left-10 md:-left-11 w-24 md:w-28 text-center px-2 py-1 text-[8px] md:text-[10px] font-bold text-white shadow-md rotate-[-45deg]",
                  listingType === "sell" ? "bg-orange-500" : "bg-upleex-blue",
                )}>
                <div className='mt-0.5 md:mt-1'>
                  {listingType.charAt(0).toUpperCase() + listingType.slice(1)}
                </div>
              </span>
            </div>
          )}

          <motion.img
            src={
              sanitizeUrl(productImage) ||
              'https://upleex.2min.cloud/upload/product_main_images/2026/01/2026-01-29/ce145a2a7c6ba13df4baceb3ac7843fd.jpg'
            }
            alt={productName}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
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

          {/* Wishlist Heart - Only show if hideWishlistIcon is not true */}
          {!product.hideWishlistIcon && (
            <motion.button
              onClick={handleWishlistClick}
              whileTap={{ scale: 0.85 }}
              animate={isWishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{
                duration: 0.35,
                ease: 'easeOut',
              }}
              className="absolute top-3 right-3 z-20 bg-white/90 p-2 rounded-full shadow hover:shadow-md"
            >
              {isWishlisted && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-red-400/30"
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              )}

              <Heart
                size={18}
                className={`relative transition-colors cursor-pointer ${isWishlisted ? 'text-red-500' : 'text-slate-500'}`}
                fill={isWishlisted ? '#ef4444' : 'none'}
              />
            </motion.button>
          )}

          {/* Category */}
          {productCategory && (
            <span className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold max-w-[150px] truncate">
              {productCategory}
            </span>
          )}

          {/* Price */}
          <div className="absolute bottom-3 right-3 z-10 bg-gradient-to-r from-upleex-blue to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            ₹{Number(productPrice ?? 0).toLocaleString()}{" "}
            {product?.product_listing_type_name
              ? `/ ${product.product_listing_type_name}`
              : ""}
          </div>

        </div>

        {/* CONTENT */}
     {/* CONTENT */}
    {/* CONTENT */}
    <div className="p-4 space-y-3">
      
      {/* NEW Badge */}
      <div className="flex justify-start items-center gap-2 min-h-[28px]">
        {product.is_new ? (
          <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md border border-green-200 whitespace-nowrap">
            NEW
          </span>
        ) : (
          <div className="h-[28px]" />
        )}
      </div>

  {/* Product Name + Verified */}
  <div className="flex items-center gap-1.5">
    <h3 className="font-semibold text-slate-800 line-clamp-1 hover:text-upleex-blue transition flex-1">
      {productName}
    </h3>
    {product.pricing_type === 'paid' && (
      <span className="relative group/verified flex-shrink-0 cursor-default">
        <GoVerified size={20} className="text-blue-600 stroke-[1] " />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover/verified:opacity-100 transition-opacity pointer-events-none z-50">
          Verified
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      </span>
    )}
  </div>
  
  {/* Location and Cancel Price in same row */}
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center text-sm text-gray-500 min-w-0 flex-1">
      <MapPin size={14} className="mr-1 flex-shrink-0" />
      <span className="truncate">{productLocation}</span>
    </div>
    
    {cancelPrice && (
      <div className="text-xs text-gray-400 line-through flex-shrink-0">
        ₹{cancelPrice}/{getListingTypeLabel()}
      </div>
    )}
  </div>
  
  {/* Button */}
  <Button
    fullWidth
    variant="primary"
    className={`mt-2 rounded-xl font-semibold tracking-wide text-white ${
      isOutOfStock && product.product_type_name === 'Sell'
        ? 'bg-gray-400 cursor-not-allowed'
        : 'cursor-pointer'
    }`}
    disabled={isOutOfStock && product.product_type_name === 'Sell'}
    onClick={(e) => {
      e.stopPropagation();
      if (!(isOutOfStock && product.product_type_name === 'Sell') && productId) {
        const urlSlug = product.slug || createSlug(productName);
        const subCatSlug = product.sub_category_slug || createSlug(product.sub_category_name || 'subcategory');
        router.push(`/${subCatSlug}/${urlSlug}`);
      }
    }}
  >
    {isOutOfStock && product.product_type_name === 'Sell'
      ? 'Out of Stock'
      : listingType === 'sell' ? 'Buy Now' : 'Take On Rent'
    }
  </Button>
</div>

      </motion.div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => {
          setIsAuthModalOpen(false);
          // Refresh wishlist after successful login
          if (productId) {
            setTimeout(() => {
              toggleWishlist(productId);
            }, 100);
          }
        }}
      />
    </>
  );
};
