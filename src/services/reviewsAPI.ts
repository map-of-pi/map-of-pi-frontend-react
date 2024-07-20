import { IUser, ReviewFeedbackType } from '@/constants/types';
import axiosClient from "@/config/client";
import axios from 'axios';


const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
});

// Fetch a single review for a seller
export const fetchSingleReview = async (reviewID: string) => {
    try {
      const response = await API.get(`/review-feedback/single/${reviewID}`);
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
  export const createReview = async (formData: FormData, token: string) => {
    try {
      const response = await API.post('/review-feedback/add', formData, {
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
  