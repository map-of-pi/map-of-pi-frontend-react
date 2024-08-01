import axiosClient from "@/config/client";
import { handleAxiosError } from "@/util/error";

// Fetch a single review for a seller
export const fetchSingleReview = async (reviewID: string) => {
  try {
    const response = await axiosClient.get(`/review-feedback/single/${reviewID}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Fetch single review failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};
  
// Fetch reviews for a seller
export const fetchReviews = async (sellerId:string) => {
  try {
    const response = await axiosClient.get(`/review-feedback/${sellerId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Fetch reviews failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};
  
// Create a new review
export const createReview = async (formData: FormData) => {
  try {
    const response = await axiosClient.post('/review-feedback/add', formData);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Create review failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};
