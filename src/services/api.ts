'use server';

import axiosClient from "@/config/client";
import { SellerType } from '@/constants/types';

// Fetch a single pioneer user
export const fetchUser = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/users/${userId}`);
    console.log('Pioneer user ', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pioneer user with ID ${userId}:`, error);
    throw error;
  }
};

// Fetch a single pioneer user configuration settings
export const fetchUserSettings = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pioneer user settings with ID ${userId}:`, error);
    throw error;
  }
};

// Create new pioneer user settings
export const createUserSettings = async (userId: string, formData: FormData) => {
  try {
    const response = await axiosClient.post(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering new seller: ', error);
    throw error;
  }
};

// Update pioneer user settings
export const updateUserSettings = async (userId: string, formData: FormData) => {
  try {
    const response = await axiosClient.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating Pioneer user settings with ID ${userId}:`, error);
    throw error;
  }
};

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

// Register a new seller
export const registerNewSeller = async (formData: SellerType, token: string) => {
  try {
    const response = await axiosClient.post('/sellers/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
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

// Function to Fetch Map Center
export const fetchMapCenter = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/map-center/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching map center for user ${userId}`, error);
    throw error;
  }
};

// Function to Save Map Center
export const saveMapCenter = async (userId: string, latitude: number, longitude: number) => {
  try {
    const response = await axiosClient.post(`/api/v1/map-center`, {
      pi_uid: userId,
      latitude,
      longitude
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error saving map center for user ${userId}:`, error);
    throw error;
  }
};
