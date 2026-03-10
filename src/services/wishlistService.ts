import { api } from '../utils/axiosInstance';

export const wishlistService = {
  getWishlist: async (page = 1, limit = 10) => {
    const response = await api.post('/wishlist/web-wishlist-list', { page, limit });
    return response.data;
  },

  addToWishlist: async (product_id: string) => {
    const response = await api.post('/wishlist/web-add-to-wishlist', { product_id });
    return response.data;
  },

  removeFromWishlist: async (product_id: string) => {
    const response = await api.post('/wishlist/web-remove-wishlist', { product_id });
    return response.data;
  },

  toggleWishlist: async (product_id: string) => {
    const response = await api.post('/wishlist/web-toggle-wishlist', { product_id });
    return response.data;
  },

  checkWishlistStatus: async (product_id: string) => {
    const response = await api.post('/wishlist/web-check-wishlist', { product_id });
    return response.data;
  }
};