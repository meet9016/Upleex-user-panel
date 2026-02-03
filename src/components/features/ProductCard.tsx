import React from 'react';
import Link from 'next/link';
import { MapPin, Heart } from 'lucide-react';
import type { Product } from '../../types';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product | any;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
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
   <div
  className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}
>
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={
            productImage ||
            'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg'
          }
          alt={productName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition" />

        {/* Wishlist */}
        <button className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full hover:text-red-500 transition">
          <Heart size={18} />
        </button>

        {/* Category */}
        {productCategory && (
          <span className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">
            {productCategory}
          </span>
        )}

        {/* Price Pill */}
        <div className="absolute bottom-3 right-3 z-10 bg-gradient-to-r from-upleex-blue to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
          ₹{Number(productPrice || 0).toLocaleString()}/mo
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <Link href={`/browse-ads/${productId}`}>
          <h3 className="font-semibold text-slate-800 line-clamp-1 hover:text-upleex-blue transition">
            {productName}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin size={14} className="mr-1" />
          {productLocation}
        </div>

        {cancelPrice && (
          <div className="text-xs text-gray-400 line-through">
            ₹{cancelPrice}/Month
          </div>
        )}

        <Link href={`/browse-ads/${productId}`}>
          <Button
            fullWidth
            variant="primary"
            className="mt-3 rounded-xl font-semibold tracking-wide"
          >
            Take On Rent
          </Button>
        </Link>
      </div>
    </div>
  );
};
