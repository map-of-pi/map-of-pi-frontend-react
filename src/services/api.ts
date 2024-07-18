'use server';

import { IUser, CreateReviewType, CreateSellerType } from '@/constants/types';
import axiosClient from "@/config/client";

// Fetch a single pioneer user
export const fetchUser = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/users/${userId}`);
    console.log('Pioneer user', response.data);
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
export const createUserSettings = async (userId:string, formData:FormData) => {
  try {
    const response = await axiosClient.post(`/users/${userId}`, formData, {
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
export const fetchSellers = async (origin:any, radius:number) => {
  try {
    const response = await axiosClient.post('/sellers/fetch', {
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
    const response = await axiosClient.get(`/sellers/${sellerId}`);
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

// Fetch a single review for a seller
export const fetchSingleReview = async (reviewID: string) => {
  try {
    const response = await axiosClient.get(`/review-feedback/single/${reviewID}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching review with ID ${reviewID}:`, error);
    throw error;
  }
};

// Fetch reviews for a seller
export const fetchReviews = async (sellerId:string) => {
  try {
    const response = await axiosClient.get(`/review-feedback/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Create a new review
export const createReview = async (auth:IUser, props: CreateReviewType, token: string) => {
  const formData = new FormData();

  formData.append('comment', props.comment);
  formData.append('rating', props.rating.toString());
  formData.append('review_receiver_id', props.seller);
  formData.append('review_giver_id', props.user);
  props.image.forEach(file => formData.append('images', file));
  formData.append('reply_to_review_id', props.replyId || '');

  // formData.append('reply_to_review_id', props.replyId)

  console.log('Form data:', formData);
  
  try {
    const response = await axiosClient.post('/review-feedback/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
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
    const response = await axiosClient.put(`/review-feedback/${reviewId}`, formData, {
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
