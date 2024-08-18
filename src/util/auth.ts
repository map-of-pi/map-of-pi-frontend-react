import axios from 'axios';
import axiosClient, { setAuthToken } from "@/config/client";

// Auto sign-in function
export const autoSigninUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token:', token);
    if (!token) {
      throw new Error('No token found');
    }

    setAuthToken(token);

    const response = await axiosClient.get('/users/me');
    console.log('Login result from autoSigninUser: ', response.data);

    return { ...response.data, token };
  } catch (error: any) {
    console.error("Error during auto sign-in: ", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Function to verify pioneer access token from the Pi Network
export const PiAuthentication = async (PioneerAccessToken: string) => {
  const header = {
    headers: {
      Authorization: `Bearer ${PioneerAccessToken}`
    }
  };
  const res = await axios.get('https://api.minepi.com/v2/me', header);
  console.log('Pioneer data obtained from Pioneer authentication', res.data)
  return res.data;
}

interface PaymentDTO {
  amount: number,
  user_uid: string,
  created_at: string,
  identifier: string,
  metadata: Object,
  memo: string,
  status: {
    developer_approved: boolean,
    transaction_verified: boolean,
    developer_completed: boolean,
    cancelled: boolean,
    user_cancelled: boolean,
  },
  to_address: string,
  transaction: null | {
    txid: string,
    verified: boolean,
    _link: string,
  },
};

export const onIncompletePaymentFound = (payment: PaymentDTO) => {
  console.log("onIncompletePaymentFound", payment);
  // return axiosClient.post('/payments/incomplete', {payment});
}
