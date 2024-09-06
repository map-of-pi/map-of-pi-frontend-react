import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchUser } from './userSlice';
import { MyPaymentMetadata, PaymentDTO } from '../../types';
import {
  onCancel,
  onError,
  onReadyForServerApproval,
  onReadyForServerCompletion,
} from '@/util/pi';

interface IPaymentState {
  isProcessing: boolean;
  error: string | null;
}

const initialState: IPaymentState = {
  isProcessing: false,
  error: null,
};

export const pay = createAsyncThunk(
  'payment/pay',
  async (
    {
      memo,
      amount,
      paymentMetadata,
    }: { memo: string; amount: number; paymentMetadata: MyPaymentMetadata },
    { dispatch, rejectWithValue },
  ) => {
    const paymentData = { amount, memo, metadata: paymentMetadata };
    const callbacks = {
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel,
      onError,
    };

    try {
      const payment: PaymentDTO = await (window as any).Pi.createPayment(
        paymentData,
        callbacks,
      );

      console.log('Payment success:', payment);

      dispatch(fetchUser());

      return payment;
    } catch (error: any) {
      console.error('Payment error:', error);
      return rejectWithValue(error.message || 'Payment failed');
    }
  },
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(pay.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(pay.fulfilled, (state, action) => {
        state.isProcessing = false;
      })
      .addCase(pay.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;
