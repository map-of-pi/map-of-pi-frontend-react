import axiosClient from "@/config/client";
import { toast } from "react-toastify";

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
export const createReview = async (formData: FormData) => {
  try {
    const response = await axiosClient.post('/review-feedback/add', formData);
    if (response.status === 200) {
      return response.data;
    }

    if (response.status === 400) {
      toast.error(response.data.message);
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      toast.info(error.response.data.message);
    } else {
      toast.error('An unexpected error occurred. Please try again.');
    }
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
  
