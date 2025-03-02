import axiosClient from "./client";
import { PaymentDataType, PaymentDTO } from "@/constants/types";

const config = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}};

export const onIncompletePaymentFound = (payment: PaymentDTO) => {
  console.log("onIncompletePaymentFound", payment);
  return axiosClient.post('/payments/incomplete', {payment}, config);
}

const onReadyForServerApproval = (paymentId: string) => {
  console.log("onReadyForServerApproval", paymentId);
  axiosClient.post('/payments/approve', {paymentId}, config);
}

const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  console.log("onReadyForServerCompletion", paymentId, txid);
  axiosClient.post('/payments/complete', { paymentId, txid }, config);
}

const onCancel = (paymentId: string) => {
  console.log("onCancel", paymentId);
  return axiosClient.post('/payments/cancelled_payment', {paymentId}, config);
}

const onError = (error: Error, payment?: PaymentDTO) => {
  console.log("onError", error);
  if (payment) {
    console.log(payment);
    // handle the error accordingly
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
  // console.log("initial payment: ", paymentId);
  return paymentId
  }