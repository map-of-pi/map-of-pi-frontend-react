import { APIPayment, APIUserScopes } from "@pinetwork-js/api-typing";
// import window  from '@pinetwork-js/sdk';
import axiosClient, { setAuthToken } from "@/config/client";


export const onIncompletePaymentFound = async (payment: APIPayment) => {
  console.log('onIncompletePaymentFound', payment);

  const token = localStorage.getItem('accessToken');
  const response = await axiosClient.post(
    '/payments/incomplete',
    { payment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
};


export const autoSigninUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    setAuthToken(token);
    
    const response = await axiosClient.get('/users/me');
    console.log('Login result from autoSigninUser:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error("Error during auto sign-in:", error.response?.data || error.message);
    throw new Error(error.response?.data.message || error.message);
  }
};


