import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-hot-toast';

export interface QuoteProduct {
  _id: string;
  product_name: string;
  product_main_image: string;
  category_name: string;
  sub_category_name: string;
  vendor_name: string;
  price: string;
  product_listing_type_name?: string;
}

export interface Quote {
  _id: string;
  product_id: QuoteProduct;
  delivery_date: string;
  number_of_days: number;
  months_id: string;
  qty: number;
  note: string;
  status: string;
  payment_status?: string;
  razorpay_payment_link?: string;
  createdAt: string;
  calculated_price?: number;
  month_name?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface QuoteState {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  processingQuoteId: string | null;
}

const initialState: QuoteState = {
  quotes: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  processingQuoteId: null,
};

export const fetchQuotes = createAsyncThunk(
  'quotes/fetchQuotes',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${endPointApi.quoteList}?view_type=quote&page=${page}&limit=${limit}`);
      if (response.data.success) {
        return {
          quotes: response.data.data || [],
          totalPages: response.data.totalPages || 1,
          currentPage: page,
        };
      }
      return rejectWithValue('Failed to fetch quotes');
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch quotes');
    }
  }
);

export const createQuoteOrder = createAsyncThunk(
  'quotes/createQuoteOrder',
  async ({ quoteId, amount }: { quoteId: string; amount: number }, { rejectWithValue }) => {
    try {
      const response = await api.post(endPointApi.quoteCreateOrder, {
        quote_id: quoteId,
        amount,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create order');
    }
  }
);

export const verifyQuotePayment = createAsyncThunk(
  'quotes/verifyQuotePayment',
  async (paymentData: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(endPointApi.quoteVerifyPayment, paymentData);
      if (response.data.success) {
        toast.success('Payment verified successfully!');
        dispatch(fetchQuotes({ page: 1, limit: 10 }));
        return response.data;
      }
      return rejectWithValue('Payment verification failed');
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Payment verification failed');
    }
  }
);

const quoteSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    clearQuotes: (state) => {
      state.quotes = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
    setProcessingQuoteId: (state, action) => {
      state.processingQuoteId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload.quotes;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createQuoteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuoteOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createQuoteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyQuotePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyQuotePayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyQuotePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearQuotes, setProcessingQuoteId } = quoteSlice.actions;
export default quoteSlice.reducer;
