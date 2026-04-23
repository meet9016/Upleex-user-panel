import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-hot-toast';

export interface DashboardData {
  totalOrders?: number;
  totalQuotes?: number;
  pendingOrders?: number;
  completedOrders?: number;
  recentOrders?: any[];
  recentQuotes?: any[];
  [key: string]: any;
}

export interface ProfileState {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  dashboardData: null,
  loading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk(
  'profile/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endPointApi.userDashboard);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to fetch dashboard data');
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: any, { rejectWithValue }) => {
    try {
      const response = await api.put(endPointApi.updateUserProfile, profileData);
      if (response.data.success) {
        toast.success('Profile updated successfully');
        return response.data.data;
      }
      return rejectWithValue('Failed to update profile');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
      return rejectWithValue(error?.response?.data?.message || 'Failed to update profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.dashboardData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboard } = profileSlice.actions;
export default profileSlice.reducer;
