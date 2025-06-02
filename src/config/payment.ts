import axiosClient from "./client";

export type PaymentDTO = {
  paymentId: string;
  txid?: string;
  memo?: string;
  metadata?: any;
};

export type PaymentDataType = {
  amount: string;
  memo: string;
  metadata: {
    paymentId: string;
  };
};

const onIncompletePaymentFound = (payment: PaymentDTO) => {
  console.log("onIncompletePaymentFound", payment);
};

const onReadyForServerApproval = (paymentId: string) => {
  return axiosClient.post("/payments/approve", { paymentId });
};

const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  return axiosClient.post("/payments/complete", { paymentId, txid });
};

const onCancel = (paymentId: string) => {
  console.log("Payment cancelled by user", paymentId);
};

const onError = (error: Error, payment?: PaymentDTO) => {
  console.error("Pi Payment Error:", error);
};

export const payWithPi = async (paymentData: PaymentDataType) => {
  const callbacks = {
    onReadyForServerApproval,
    onReadyForServerCompletion,
    onIncompletePaymentFound,
    onCancel,
    onError,
  };
  return await window.Pi.createPayment(paymentData, callbacks);
};
