'use server';

import axios from 'axios';
import { ReviewFeedbackType, UserType, CreateReviewType } from '@/constants/types';
import axiosClient, { setAuthToken } from "@/config/client";

const API = axios.create({
  baseURL: process.env.PROD_API_URL || 'http://localhost:8001/api/v1',
  
});

// Authenticate user
export const authenticateUser = async (uid:string, username:string) => {
  try {
    const response = await API.post('/users/authenticate', {
      auth: {
        user: {
          uid,
          username,
        },
      },
    });
    
    const accessToken = response.data.token;
    if (response.data.token){
      setAuthToken(accessToken);
      console.log('Access token set to header successfully');
    }
    
    return response.data;
  } catch (error) {
    // console.error('Error authenticating user:', error);
    // return {message: 'Error authenticating user'};
    throw error;
  }
};

// Fetch a single pioneer user
export const fetchUser = async (userId: string) => {
  try {
    const response = await API.get(`/users/${userId}`);
    console.log(response.data)
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
export const fetchSellers = async (origin: any, radius: number) => {
  try {
    const params = origin && radius ? { origin, radius } : {};
    const response = await API.get('/sellers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }
};

// Fetch single seller by ID
export const fetchSingleSeller = async (sellerId:string) => {
  try {
    const response = await API.get(`/sellers/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Register a new seller
export const registerNewSeller = async (formData:FormData) => {
  try {
    const response = await API.post('/sellers/register', formData, {
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

// Fetch a single review for a seller
export const fetchSingleReview = async (reviewID: string) => {
  try {
    const response = await API.get(`/review-feedback/${reviewID}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching review with ID ${reviewID}:`, error);
    throw error;
  }
};

// Fetch reviews for a seller
export const fetchReviews = async (sellerId:string) => {
  try {
    const response = await API.get(`/review-feedback/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Create a new review
export const createReview = async (auth:UserType, params: CreateReviewType) => {
  const formData = new FormData();

  formData.append('comment', params.comment);
  formData.append('rating', params.rating.toString());
  formData.append('review_receiver_id', params.seller);
  formData.append('review_giver_id', params.user);
  params.image.forEach(file => formData.append('images', file));

  console.log('this is form data:', formData)
  
  try {
    const response = await API.post('/review-feedback/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${auth.token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId:string, formData:FormData, authToken: string) => {
  try {
    const response = await API.put(`/review-feedback/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating review with ID ${reviewId}:`, error);
    throw error;
  }
};
