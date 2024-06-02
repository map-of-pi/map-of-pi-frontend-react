
import axiosClient, { setAuthToken } from "@/config/client";
import { APIPayment } from "@pinetwork-js/api-typing"

export const autoSigninUser = async () => {
    try {
      setAuthToken();
      const result = await axiosClient.get('/api/v1/users/me');
      return result;
    } catch (error: any) {
      console.error("Error during auto sign-in:", error.response?.data || error.message);
      throw new Error(error.response?.data.message || error.message);
    }
  };
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


  // todod u will put other function s here like comleting transaction, verifying transaction