'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { toast } from 'react-hot-toast';

interface WishlistItem {
  _id: string;
  product_id: {
    _id: string;
    product_name: string;
    price: string;
    cancel_price: string;
    product_main_image: string;
    category_name: string;
    sub_category_name: string;
    vendor_name: string;
    status: string;
    product_listing_type_name?: string;
    product_type_name?: string;
    month_arr?: any[];
  };
  createdAt: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Clear wishlist when no token
        setWishlistItems([]);
        return;
      }
      
      setLoading(true);
      const response = await wishlistService.getWishlist(1, 100);
      console.log('Wishlist response:', response);
      
      if (response.success) {
        setWishlistItems(response.data.items || []);
      }
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) {
        // Clear wishlist on auth error
        setWishlistItems([]);
      } else {
        toast.error('Failed to load wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      console.log('Adding to wishlist:', productId);
      const response = await wishlistService.addToWishlist(productId);
      if (response.success) {
        toast.success('Product added to wishlist');
        await fetchWishlist();
      }
    } catch (error: any) {
      console.error('Add to wishlist error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      console.log('Removing from wishlist:', productId);
      const response = await wishlistService.removeFromWishlist(productId);
      if (response.success) {
        toast.success('Product removed from wishlist');
        // Update state immediately
        setWishlistItems(prev => prev.filter(item => item.product_id.id !== productId));
      }
    } catch (error: any) {
      console.error('Remove from wishlist error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    try {
      console.log('Toggling wishlist:', productId);
      const response = await wishlistService.toggleWishlist(productId);
      if (response.success) {
        toast.success(response.message);
        await fetchWishlist();
        return response.inWishlist;
      }
      return false;
    } catch (error: any) {
      console.error('Toggle wishlist error:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
      return false;
    }
  };

  const isInWishlist = (productId: string): boolean => {
    if (!productId) return false;
    const found = wishlistItems.some(item => item.product_id.id === productId);
    console.log('isInWishlist check:', productId, 'found:', found);
    return found;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchWishlist();
    } else {
      // Clear wishlist when no token
      setWishlistItems([]);
    }

    // Listen for storage changes (logout events)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      if (!newToken) {
        setWishlistItems([]);
      } else {
        fetchWishlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: WishlistContextType = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};