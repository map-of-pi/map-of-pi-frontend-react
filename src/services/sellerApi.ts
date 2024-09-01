import axiosClient from "@/config/client";
import { handleAxiosError } from "@/utils/error";

import logger from '../../logger.config.mjs';

// Fetch all sellers or within bounds
export const fetchSellers = async (origin: any, radius: number) => {
  try {
    logger.info('Fetching sellers with origin and radius:', { origin, radius });
    const response = await axiosClient.post('/sellers/fetch', {
      origin,
      radius
    });
    if (response.status === 200) {
      logger.info(`Fetch sellers successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch sellers failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Fetch sellers encountered an error:', { error, origin, radius });
    handleAxiosError(error);
    throw error;
  }
};
  
export const fetchSingleSeller = async (sellerId: string) => {
  try {
    logger.info(`Fetching single seller with ID: ${sellerId}`);
    const response = await axiosClient.get(`/sellers/${sellerId}`);
    if (response.status === 200) {
      logger.info(`Fetch single seller successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch single seller failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Fetch single seller encountered an error:', { error, sellerId });
    handleAxiosError(error);
    throw error;
  }
};

export const fetchSellerRegistration = async () => {
  try {
    logger.info('Fetching seller registration info..');
    const response = await axiosClient.post('/sellers/me');
    if (response.status === 200) {
      logger.info(`Fetch seller registration successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch seller registration failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Fetch seller registration encountered an error:', { error });
    handleAxiosError(error);
    throw error;
  }
};

// Register or update seller
export const registerSeller = async (formData: any) => {
  try {
    logger.info('Creating or updating seller registration with formData..');
    const response = await axiosClient.put('/sellers/register', {json: JSON.stringify(formData)});
    if (response.status === 200) {
      logger.info(`Create or update seller registration successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Create or update seller registration failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Create or update seller registration encountered an error:', { error, formData });
    handleAxiosError(error);
    throw error;
  }
};
  