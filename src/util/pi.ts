import axiosClient from '@/config/client';
import { PaymentDTO } from '../../types';

export const onIncompletePaymentFound = (payment: PaymentDTO) => {
  console.log('onIncompletePaymentFound', payment);
  return axiosClient.post(
    '/payments/incomplete',
    { payment },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
};

export const onReadyForServerApproval = (paymentId: string) => {
  console.log('onReadyForServerApproval', paymentId);
  axiosClient.post(
    '/payments/approve',
    { paymentId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
};

export const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  console.log('onReadyForServerCompletion', paymentId, txid);
  axiosClient.post(
    '/payments/complete',
    { paymentId, txid },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
};

export const onCancel = (paymentId: string) => {
  console.log('onCancel', paymentId);
  return axiosClient.post(
    '/payments/cancelled_payment',
    { paymentId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
};

export const onError = (error: Error, payment?: PaymentDTO) => {
  console.log('onError', error);
  if (payment) {
    console.log(payment);
  }
};
