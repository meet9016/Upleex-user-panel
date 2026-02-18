'use client';

import { Button } from '@/components/ui/Button';
import { Store, Star } from 'lucide-react';
import { ProductCard } from '@/components/features/ProductCard';
import { BackButton } from '@/components/ui/BackButton';

const SELLER_INFO = {
  name: 'U.B ENTERPRISES',
  rating: 4.1,
  ratingsCount: 8777,
  followers: 62,
  productsCount: 8
};

const SELLER_PRODUCTS = [
  {
    product_id: 1,
    product_name: 'Charvi Petite Women Kurti Set',
    product_main_image:
      'https://images.unsplash.com/photo-1542060748-10c28b62716a?q=80&w=1200&auto=format&fit=crop',
    price: 315,
    cancel_price: 399,
    sub_category_name: 'Cotton Blend • Printed',
    product_listing_type_name: 'sell',
    location: 'Surat'
  },
  {
    product_id: 2,
    product_name: 'Trendy Pretty Kurtis',
    product_main_image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    price: 361,
    cancel_price: 449,
    sub_category_name: 'Designer Kurtis Collection',
    product_listing_type_name: 'sell',
    location: 'Surat'
  },
  {
    product_id: 3,
    product_name: 'Trendy Dupatta Sets',
    product_main_image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop',
    price: 381,
    cancel_price: 459,
    sub_category_name: 'Soft Georgette Dupatta',
    product_listing_type_name: 'sell',
    location: 'Surat'
  },
  {
    product_id: 4,
    product_name: 'Aakarsha Sensational Kurtis',
    product_main_image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    price: 599,
    cancel_price: 749,
    sub_category_name: 'Party Wear • Pack of 4',
    product_listing_type_name: 'sell',
    location: 'Surat'
  },
  {
    product_id: 5,
    product_name: 'Kurti With Bottomwear',
    product_main_image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    price: 603,
    cancel_price: 799,
    sub_category_name: 'Comfort Fit Set',
    product_listing_type_name: 'sell',
    location: 'Surat'
  }
];

export default function SellerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <BackButton/>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 px-6 sm:px-8 py-5 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <Store size={32} className="text-upleex-blue" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-[0.18em] mb-1">
                Sold By
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {SELLER_INFO.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                  <span className="text-sm mr-1">
                    {SELLER_INFO.rating.toFixed(1)}
                  </span>
                  <Star size={14} className="text-blue-600 fill-blue-600" />
                </div>
                <span>
                  {SELLER_INFO.ratingsCount.toLocaleString()} Ratings
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>
                  <span className="font-semibold">
                    {SELLER_INFO.followers}
                  </span>{' '}
                  Followers
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>
                  <span className="font-semibold">
                    {SELLER_INFO.productsCount}
                  </span>{' '}
                  Products
                </span>
              </div>
            </div>
          </div>

          
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Products from {SELLER_INFO.name}
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {SELLER_PRODUCTS.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
