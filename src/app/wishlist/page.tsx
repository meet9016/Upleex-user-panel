'use client';

import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '../../components/features/ProductCard';
import { BackButton } from '@/components/ui/BackButton';

const WishlistPage = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="mx-auto h-24 w-24 text-gray-300" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="mt-2 text-lg text-gray-600">
              Start adding products you love to your wishlist
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <BackButton />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="h-9 w-9 text-red-500 fill-red-500" />
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {wishlistItems.map((wishlistEntry, index) => {
            const productData = wishlistEntry.product_id;
            
            if (!productData) {
              console.log('No product data for wishlist item:', wishlistEntry);
              return null;
            }

            // Use the 'id' field from the API response
            const productId = productData.id;
            console.log('Product ID from API:', productId);

            // Create proper product object for ProductCard
            const product = {
              ...productData,
              _id: productId,
              product_id: productId,
              id: productId,
            };

            console.log('Final product object for ProductCard:', product);

            return (
              <div key={`wishlist-${wishlistEntry.id || index}`} className="relative group">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    console.log('Removing product:', productId);
                    await removeFromWishlist(productId);
                  }}
                  className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>

                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;