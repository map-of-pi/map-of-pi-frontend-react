import axiosClient from "@/config/client";
import { getMultipartFormDataHeaders } from "@/utils/api";
import { handleAxiosError } from "@/utils/error";

import logger from '../../logger.config.mjs';

// Fetch a single review for a seller
export const fetchSingleReview = async (reviewID: string) => {
  try {
    logger.info(`Fetching single review with ID: ${reviewID}`);
    const response = await axiosClient.get(`/review-feedback/single/${reviewID}`);
    if (response.status === 200) {
      logger.info(`Fetch single review successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch single review failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Fetch single review encountered an error:', { error, reviewID });
    handleAxiosError(error);
    throw error;
  }
};
  
// Fetch reviews for a seller
export const fetchReviews = async (userId:string) => {
  try {
    logger.info(`Fetching reviews for seller with ID: ${userId}`);
    const response = await axiosClient.get(`/review-feedback/${userId}`);
    if (response.status === 200) {
      logger.info(`Fetch reviews successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch reviews failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Fetch reviews encountered an error:', { error, userId });
    handleAxiosError(error);
    throw error;
  }
};
  
// Create a new review
export const createReview = async (formData: FormData) => {
  try {
    logger.info('Creating a new review with formData..');
    const headers = getMultipartFormDataHeaders();

    const response = await axiosClient.post('/review-feedback/add', formData, { headers });
    
    if (response.status === 200) {
      logger.info(`Create review successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Create review failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Create review encountered an error:', { error });
    handleAxiosError(error);
    throw error;
  }
};
