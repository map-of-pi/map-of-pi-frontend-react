import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../types';
import { AuthResult } from '@pinetwork-js/sdk/build/types';
import { onIncompletePaymentFound } from '@/util/auth';
import axiosClient from '@/config/client';
import { APIUserScopes } from '@pinetwork-js/api-typing';

const scopes: APIUserScopes[] = [
  'username',
  'payments',
  'platform',
  'wallet_address',
];

interface IRootState {
  currentUser: IUser | null;
  isInitialized: boolean;
  isLoading: boolean;
}

const initialState: IRootState = {
  currentUser: null,
  isInitialized: false,
  isLoading: true,
};

export const initializePiSDK = createAsyncThunk(
  'user/initializePiSDK',
  async (_, { dispatch }) => {
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.minepi.com/pi-sdk.js';
      script.onload = resolve;
      document.body.appendChild(script);
    });

    if (window.Pi) {
      window.Pi.init({ version: '2.0', sandbox: true });

      const checkInitialized = () => {
        return new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (window.Pi?.initialized) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      };

      console.log('SDK initialized successfully');

      await checkInitialized();
      dispatch(setIsInitialized(true));
    } else {
      throw new Error('Pi SDK not loaded.');
    }
  },
);

export const authenticateUser = createAsyncThunk(
  'user/authenticateUser',
  async (_, { dispatch }) => {
    try {
      const authResult: AuthResult = await window.Pi.authenticate(
        scopes,
        onIncompletePaymentFound,
      );
      dispatch(signInUser(authResult));
    } catch (error: any) {
      console.error('Authentication failed:', error.message);
      throw error;
    }
  },
);

export const signInUser = createAsyncThunk(
  'user/signInUser',
  async (authResult: AuthResult, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/signin', { authResult });
      localStorage.setItem('token', response.data.token);
      dispatch(setCurrentUser(response.data.user));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  },
);
export const fetchUser = createAsyncThunk(
  'user/me',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/user/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(setCurrentUser(response.data));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializePiSDK.fulfilled, (state) => {
        state.isInitialized = true;
      })
      .addCase(authenticateUser.fulfilled, (state) => {})
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signInUser.rejected, (state, action) => {
        console.error('Sign-in failed:', action.payload);
        state.isLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        console.error('failed to fetch user', action.payload);
        state.isLoading = false;
      })
      .addCase(fetchUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        (state.currentUser = action.payload), (state.isLoading = false);
      });
  },
});

export const { setCurrentUser, setIsInitialized } = userSlice.actions;

export default userSlice.reducer;
