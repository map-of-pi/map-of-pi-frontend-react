'use server';

import axios from 'axios';
import { z } from 'zod';
import { IUser, ReviewFeedbackType, CreateSellerType } from '@/constants/types';
import axiosClient, { setAuthToken } from "@/config/client";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
});


// Fetch a single pioneer user
export const fetchUser = async (userId: string) => {
  try {
    const response = await API.get(`/users/${userId}`);
    console.log('pioneer user', response.data)
    return response.data;
  } catch (error) {
    // console.error(`Error fetching pioneer user with ID ${userId}:`, error);
    return {message: 'Error fetching pioneer user with ID',}
  }
};

// Fetch a single pioneer user configuration settings
export const fetchUserSettings = async (userId: string) => {
  try {
    const response = await API.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pioneer user configuration settings with ID ${userId}:`, error);
    throw error;
  }
};

// Create new pioneer user settings
export const createUserSettings = async (userId:string, formData:FormData) => {
  try {
    const response = await API.post(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering new seller:', error);
    throw error;
  }
};

// Update pioneer user settings
export const updateUserSettings = async (userId:string, formData:FormData) => {
  try {
    const response = await API.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating pioneer user configuration settings with ID ${userId}:`, error);
    throw error;
  }
};

// Fetch all sellers or within bounds
export const fetchSellers = async (origin:any, radius:number) => {
  try {
    const response = await API.post('/sellers/fetch', {
      origin,
      radius
    });
    return response.data;
  } catch (error:any) {
    console.error('Error fetching sellers:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const fetchSingleSeller = async (sellerId:string) => {
  try {
    const response = await API.get(`/sellers/${sellerId}`);
    return response.data; // Assuming response.data directly contains the seller object
  } catch (error:any) {
    if (error.response && error.response.status === 404) {
      // Seller not found
      return null; // or return an empty object {} as per your requirement
    }
    console.error(`Error fetching seller with ID ${sellerId}:`, error);
    throw error;
  }
};


// Register a new seller
export const registerNewSeller = async (formData: CreateSellerType, token: string) => {
  try {
    const response = await axiosClient.post('/sellers/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // 'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering new seller:', error);
    throw error;
  }
};

// Update an existing seller
export const updateSeller = async (sellerId:string, formData: FormData) => {
  try {
    const response = await API.put(`/sellers/${sellerId}`, formData, {
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

