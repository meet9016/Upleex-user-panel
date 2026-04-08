import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export const wishlistService = {
  getWishlist: async (page = 1, limit = 10) => {
    const response = await api.post(endPointApi.webWishlistList, { page, limit });
    return response.data;
  },

  addToWishlist: async (product_id: string) => {
    const response = await api.post(endPointApi.webAddToWishlist, { product_id });
    return response.data;
  },

  removeFromWishlist: async (product_id: string) => {
    const response = await api.post(endPointApi.webRemoveWishlist, { product_id });
    return response.data;
  },

  toggleWishlist: async (product_id: string) => {
    const response = await api.post(endPointApi.webToggleWishlist, { product_id });
    return response.data;
  },

  checkWishlistStatus: async (product_id: string) => {
    const response = await api.post(endPointApi.webCheckWishlist, { product_id });
    return response.data;
  }
};