'use server';

import { z } from 'zod';
import { IUser, ReviewFeedbackType } from '@/constants/types';
import axiosClient from "@/config/client";

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
  export const createReview = async (auth:IUser, props: ReviewFeedbackType, token: string) => {
    const formData = new FormData();
  
    formData.append('comment', props.comment);
    formData.append('rating', props.rating.toString());
    formData.append('review_receiver_id', props.review_receiver_id);
    formData.append('review_giver_id', props.review_giver_id);
    // props.image.forEach(file => formData.append('images', file));
    formData.append('image', props.image);
    formData.append('reply_to_review_id', props.reply_to_review_id || '')
  
    // formData.append('reply_to_review_id', props.replyId)
  
    console.log('this is form data:', formData)
    
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
  