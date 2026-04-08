import { api } from '../utils/axiosInstance';

export const reviewService = {
  // Get all reviews for a product
  getProductReviews: async (productId: string, page = 1, limit = 10) => {
    const response = await api.post('/reviews/product-reviews', { 
      product_id: productId,
      page, 
      limit 
    });
    return response.data;
  },

  // Add a new review
  addReview: async (data: {
    product_id: string;
    rating: number;
    review: string;
  }) => {
    const response = await api.post('/reviews/add', data);
    return response.data;
  },

  // Update existing review
  updateReview: async (data: {
    review_id: string;
    rating: number;
    review: string;
  }) => {
    const response = await api.post('/reviews/update', data);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId: string) => {
    const response = await api.post('/reviews/delete', { review_id: reviewId });
    return response.data;
  },

  // Check if user has already reviewed this product
  checkUserReview: async (productId: string) => {
    const response = await api.post('/reviews/check-user-review', { 
      product_id: productId 
    });
    return response.data;
  },

  // Get review statistics for a product
  getReviewStats: async (productId: string) => {
    const response = await api.post('/reviews/stats', { 
      product_id: productId 
    });
    return response.data;
  }
};
