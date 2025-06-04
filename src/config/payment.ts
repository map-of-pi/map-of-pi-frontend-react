import axiosClient from "./client";
import { PaymentDataType, PaymentDTO } from "@/constants/types";

const config = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}};

export const onIncompletePaymentFound = (payment: PaymentDTO) => {
  return axiosClient.post('/payments/incomplete', {payment}, config);
}

const onReadyForServerApproval = (paymentId: string) => {
  axiosClient.post('/payments/approve', {paymentId}, config);
}

const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  axiosClient.post('/payments/complete', { paymentId, txid }, config);
}

const onCancel = (paymentId: string) => {
  return axiosClient.post('/payments/cancelled_payment', { paymentId }, config);
}

const onError = (error: Error, payment?: PaymentDTO) => {
  if (payment) {
    // TODO: handle the error accordingly
  }
}

export const payWithPi = async (paymentData: PaymentDataType) => {
  const callbacks = {    
    onReadyForServerApproval,
    onReadyForServerCompletion,
    onIncompletePaymentFound,
    onCancel,
    onError
  };

  const paymentId = await window.Pi.createPayment(
    paymentData, 
    {...callbacks}    
  );

  return paymentId;
}