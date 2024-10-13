import axiosClient from "@/config/client";
import { getMultipartFormDataHeaders } from '@/utils/api';
import logger from '../../logger.config.mjs';

// Fetch all sellers or sellers within bounds and/ or matching search criteria
export const fetchSellers = async (bounds: L.LatLngBounds, searchQuery?: string) => {
  try {
    logger.debug('Fetching sellers with bounds and search query:', { bounds, searchQuery });
    
    // Prepare the request payload with bounds
    const requestPayload: any = {
      bounds: {
        sw_lat: bounds.getSouthWest().lat,
        sw_lng: bounds.getSouthWest().lng,
        ne_lat: bounds.getNorthEast().lat,
        ne_lng: bounds.getNorthEast().lng,
      }
    };
    
    if (searchQuery) {
      requestPayload.search_query = searchQuery;
    }
    
    const response = await axiosClient.post('/sellers/fetch', requestPayload);
    
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
    logger.error('Fetch sellers encountered an error:', { 
      message: error.message,
      config: error.config,
      stack: error.stack
    });
    throw new Error('Failed to fetch sellers. Please try again later.');
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
    logger.error('Fetch single seller encountered an error:', { 
      message: error.message,
      config: error.config,
      stack: error.stack
    });
    throw new Error('Failed to fetch single seller. Please try again later.');
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
    logger.error('Fetch seller registration encountered an error:', { 
      message: error.message,
      config: error.config,
      stack: error.stack
    });
    throw new Error('Failed to fetch seller registration. Please try again later.');
  }
};

// Register or update seller
export const registerSeller = async (formData: FormData) => {
  try {
    logger.info('Creating or updating seller registration with formData..');
    const headers = getMultipartFormDataHeaders();

    const response = await axiosClient.put('/sellers/register', formData, { headers });

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
    logger.error('Create or update seller registration encountered an error:', { 
      message: error.message,
      config: error.config,
      stack: error.stack
    });
    throw new Error('Failed to register seller. Please try again later.');
  }
};
  