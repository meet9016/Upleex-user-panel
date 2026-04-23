import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartService, CartItem, CartSummary } from '@/services/cartService';
import { toast } from 'react-hot-toast';

export interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  summary: null,
  loading: false,
  error: null,
};

// Async thunk to fetch cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.getCartList();
    if (response.status === 200) {
      return {
        items: response.data || [],
        summary: response.summary || null,
      };
    }
    return rejectWithValue(response.message || 'Failed to fetch cart');
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to fetch cart');
  }
});

// Async thunk to add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, qty }: { productId: string; qty: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(productId, qty);
      if ((response as any)?.status === 200 || (response as any)?.success === true) {
        toast.success('Successfully added to cart');
        dispatch(fetchCart());
        return response;
      } else {
        toast.error(response.message || 'Failed to add to cart');
        return rejectWithValue(response.message || 'Failed to add to cart');
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      }
      toast.error('Something went wrong');
      return rejectWithValue('Something went wrong');
    }
  }
);

// Async thunk to update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartId, qty }: { cartId: string; qty: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(cartId, qty);
      if (response.status === 200) {
        dispatch(fetchCart());
        return response.data;
      } else {
        toast.error(response.message || 'Failed to update quantity');
        return rejectWithValue(response.message || 'Failed to update quantity');
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      }
      toast.error('Something went wrong');
      return rejectWithValue('Something went wrong');
    }
  }
);

// Async thunk to remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(cartId);
      if (response.status === 200) {
        toast.success('Item removed from cart');
        dispatch(fetchCart());
        return cartId;
      } else {
        toast.error(response.message || 'Failed to remove item');
        return rejectWithValue(response.message || 'Failed to remove item');
      }
    } catch (error: any) {
      toast.error('Something went wrong');
      return rejectWithValue('Something went wrong');
    }
  }
);

// Async thunk to clear cart
export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.clearCart();
    if (response.status === 200) {
      toast.success('Cart cleared successfully');
      return true;
    } else {
      toast.error(response.message || 'Failed to clear cart');
      return rejectWithValue(response.message || 'Failed to clear cart');
    }
  } catch (error: any) {
    toast.error('Something went wrong');
    return rejectWithValue('Something went wrong');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.summary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.summary = action.payload.summary;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.summary = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
