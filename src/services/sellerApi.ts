import axiosClient from "@/config/client";

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
    console.error(`Error fetching seller with ID ${sellerId}: `, error);
    throw error;
  }
};

export const fetchSellerRegistration = async () => {
  try {
    const response = await axiosClient.post('/sellers/me');
    return response.data;
  } catch (error:any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error(`Error fetching seller registration `, error);
    throw error;
  }
};

// Register or update seller
export const registerSeller = async (formData: any) => {
  try {
    const response = await axiosClient.post('/sellers/register', {data: JSON.stringify(formData)});
    return response.data;
  } catch (error) {
    console.error('Error registering or updating seller: ', error);
    throw error;
  }
};
  
