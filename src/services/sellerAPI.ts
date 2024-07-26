import axiosClient from "@/config/client";
import { SellerType } from '@/constants/types';


// Fetch all sellers or within bounds
export const fetchSellers = async (origin: any, radius: number) => {
    try {
      const response = await axiosClient.post('/sellers/fetch', {
        origin,
        radius
      });
      return response.data;
    } catch (error:any) {
      console.error('Error fetching sellers: ', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  
  export const fetchSingleSeller = async (sellerId: string) => {
    try {
      const response = await axiosClient.get(`/sellers/${sellerId}`);
      return response.data;
    } catch (error:any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error(`Error fetching seller with ID ${sellerId}:`, error);
      throw error;
    }
  };

  export const fetchOwnSeller = async () => {
    try {
      const response = await axiosClient.post('/sellers/own_seller');
      return response.data;
    } catch (error:any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error(`Error fetching registered seller`, error);
      throw error;
    }
  };

  
  // Register a new seller
  export const registerNewSeller = async (formData: any) => {
    try {
      const response = await axiosClient.post('/sellers/register', {data: JSON.stringify(formData)});
      return response.data;
    } catch (error) {
      console.error('Error registering new seller: ', error);
      throw error;
    }
  };

  
  // Update an existing seller
  export const updateSeller = async (sellerId: string, formData: FormData) => {
    try {
      const response = await axiosClient.put(`/sellers/${sellerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating seller with ID ${sellerId}:`, error);
      throw error;
    }
  };
  