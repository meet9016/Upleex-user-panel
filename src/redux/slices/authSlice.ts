import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, SendOtpParams, VerifyOtpParams } from '@/services/authService';
import { setSecureToken, removeSecureToken } from '@/utils/cryptoUtils';
import { toast } from 'react-hot-toast';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  mobile: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  profile_photo: string;
  [key: string]: any;
}

export interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userType: 'existing' | 'new' | null;
  step: 'number' | 'otp';
}

const loadUserFromStorage = (): UserData | null => {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch {
      return null;
    }
  }
  return null;
};

const loadTokenFromStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const encoded = localStorage.getItem('token');
      if (!encoded) return null;
      return atob(encoded.split('').reverse().join(''));
    } catch {
      // Fallback in case it was stored raw or if localStorage threw an error
      try {
        return localStorage.getItem('token');
      } catch {
        return null;
      }
    }
  }
  return null;
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  token: loadTokenFromStorage(),
  isAuthenticated: !!loadTokenFromStorage(),
  loading: false,
  error: null,
  userType: null,
  step: 'number',
};

// Async thunk for sending OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (params: SendOtpParams, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp(params);
      if (response?.status === 200 || response?.success === true) {
        return response;
      } else {
        return rejectWithValue(response?.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Something went wrong');
    }
  }
);

// Async thunk for verifying OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (params: VerifyOtpParams, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(params);
      if (response?.status === 200 || response?.success === true) {
        return response;
      } else {
        return rejectWithValue(response?.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<'existing' | 'new' | null>) => {
      state.userType = action.payload;
    },
    setStep: (state, action: PayloadAction<'number' | 'otp'>) => {
      state.step = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.step = 'number';
      removeSecureToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        // Instant socket disconnect — same tab
        window.dispatchEvent(new Event('userLoggedOut'));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Set login data directly (used by AuthModal to avoid double API call)
    setLoginData: (state, action: PayloadAction<{ token: string; user: any }>) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        mobile: user.mobile,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name,
        gender: user.gender,
        profile_photo: user.profile_photo,
      };
      state.isAuthenticated = true;
      setSecureToken(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('email', JSON.stringify(user.email));
      }
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.userType = action.payload.data?.user_type;
        state.step = 'otp';
        toast.success(action.payload.message || 'OTP sent successfully');
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        const { token, user } = action.payload.data;
        
        state.token = token;
        state.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          mobile: user.mobile,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          gender: user.gender,
          profile_photo: user.profile_photo,
        };
        state.isAuthenticated = true;
        state.step = 'number';

        // Store in localStorage
        setSecureToken(token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
          localStorage.setItem('email', JSON.stringify(user.email));
          // Instant socket connect — same tab
          window.dispatchEvent(new Event('userLoggedIn'));
        }

        toast.success(action.payload.message || 'Login successful');
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { setUserType, setStep, logout, clearError, setLoginData } = authSlice.actions;
export default authSlice.reducer;
