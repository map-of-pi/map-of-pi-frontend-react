import axiosClient from "@/config/client";
import { handleAxiosError } from "@/util/error";

// Fetch all sellers or within bounds
export const fetchSellers = async (origin: any, radius: number) => {
  try {
    const response = await axiosClient.post('/sellers/fetch', {
      origin,
      radius
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Fetch sellers failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};
  
export const fetchSingleSeller = async (sellerId: string) => {
  try {
    const response = await axiosClient.get(`/sellers/${sellerId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Fetch single seller failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};

export const fetchSellerRegistration = async () => {
  try {
    const response = await axiosClient.post('/sellers/me');
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Fetch seller registration failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};

// Register or update seller
export const registerSeller = async (formData: any) => {
  try {
    const response = await axiosClient.put('/sellers/register', {json: JSON.stringify(formData)});
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Seller registeration failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};
  