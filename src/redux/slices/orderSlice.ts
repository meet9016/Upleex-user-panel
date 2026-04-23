import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-hot-toast';

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  final_amount: number;
}

export interface Order {
  _id: string;
  order_id: string;
  items: OrderItem[];
  subtotal: number;
  gst_amount: number;
  total_amount: number;
  payment_status: string;
  order_status: string;
  vendor_status: string;
  createdAt: string;
  razorpay_payment_id: string;
  type?: 'order' | 'quote';
  razorpay_payment_link?: string;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const [ordersRes, quotesRes] = await Promise.allSettled([
        api.get(`${endPointApi.userOrders}?page=${page}&limit=${limit}`),
        api.get(`${endPointApi.quoteList}?view_type=order&page=${page}&limit=${limit}`)
      ]);

      let combined: Order[] = [];
      let maxPages = 1;

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
        const fetchedOrders = (ordersRes.value.data.data.orders || []).map((o: any) => ({ 
          ...o, 
          type: 'order',
          order_status: o.vendor_status || o.order_status 
        }));
        combined = [...combined, ...fetchedOrders];
        maxPages = Math.max(maxPages, ordersRes.value.data.data.pagination?.pages || 1);
      }

      if (quotesRes.status === 'fulfilled' && quotesRes.value.data.success) {
        const mappedQuotes = (quotesRes.value.data.data || [])
          .map((quote: any) => ({
            _id: quote._id,
            order_id: `QUOTE-${quote._id.slice(-6).toUpperCase()}`,
            items: [{
              product_id: quote.product_id?._id || '',
              product_name: quote.product_id?.product_name || 'Rent Product',
              product_image: quote.product_id?.product_main_image || '',
              price: (quote.calculated_price || 0) / (quote.qty || 1),
              quantity: quote.qty || 1,
              final_amount: quote.calculated_price || 0
            }],
            subtotal: quote.calculated_price || 0,
            gst_amount: 0,
            total_amount: quote.calculated_price || 0,
            payment_status: quote.payment_status || 'pending',
            order_status: quote.status || 'pending',
            createdAt: quote.createdAt,
            razorpay_payment_id: quote.razorpay_payment_id || '',
            type: 'quote',
            razorpay_payment_link: quote.razorpay_payment_link || '',
          }));
        combined = [...combined, ...mappedQuotes];
        maxPages = Math.max(maxPages, quotesRes.value.data.totalPages || 1);
      }

      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return { orders: combined, totalPages: maxPages, currentPage: page };
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return { orders: [], totalPages: 1, currentPage: 1 };
      }
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
