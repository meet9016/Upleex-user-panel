import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '@/services/wishlistService';
import { getSecureToken } from '@/utils/cryptoUtils';
import { toast } from 'react-hot-toast';

export interface WishlistProduct {
  id: any;
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
}

export interface WishlistItem {
  id: string;
  product_id: WishlistProduct;
  createdAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to fetch wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const token = getSecureToken();
    if (!token) {
      return { items: [] };
    }

    const response = await wishlistService.getWishlist(1, 100);
    if (response.success) {
      return {
        items: response.data.items || [],
      };
    }
    return rejectWithValue('Failed to load wishlist');
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { items: [] };
    }
    return rejectWithValue('Failed to load wishlist');
  }
});

// Async thunk to add to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      const token = getSecureToken();
      if (!token) {
        return rejectWithValue('AUTH_REQUIRED');
      }

      const response = await wishlistService.addToWishlist(productId);
      if (response.success) {
        toast.success('Product added to wishlist');
        dispatch(fetchWishlist());
        return response;
      }
      return rejectWithValue(response.message || 'Failed to add to wishlist');
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return rejectWithValue('AUTH_REQUIRED');
      }
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// Async thunk to remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);
      if (response.success) {
        toast.success('Product removed from wishlist');
        dispatch(fetchWishlist());
        return productId;
      }
      return rejectWithValue(response.message || 'Failed to remove from wishlist');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

// Async thunk to toggle wishlist
export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      const token = getSecureToken();
      if (!token) {
        return rejectWithValue('AUTH_REQUIRED');
      }

      const response = await wishlistService.toggleWishlist(productId);
      if (response.success) {
        toast.success(response.message);
        dispatch(fetchWishlist());
        return {
          productId,
          inWishlist: response.inWishlist,
        };
      }
      return rejectWithValue(response.message || 'Failed to update wishlist');
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return rejectWithValue('AUTH_REQUIRED');
      }
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
      return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistState: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle Wishlist
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleWishlist.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
