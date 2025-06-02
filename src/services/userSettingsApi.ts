import axiosClient from "@/config/client";
import { getMultipartFormDataHeaders } from "@/utils/api";
import logger from '../../logger.config.mjs';

// Helper to read token from cookies
const getTokenFromCookie = () => {
  if (typeof document !== 'undefined') {
    return document.cookie
      ?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
  }
  return null;
};

// Fetch the user settings of the user
export const fetchUserSettings = async () => {
  try {
    logger.info('Fetching user settings..');
    const token = getTokenFromCookie();

    const response = await axiosClient.post(
      `/user-preferences/me`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200) {
      logger.info(`Fetch user settings successful`, { data: response.data });
      return response.data;
    } else {
      logger.error(`Fetch user settings failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Fetch user settings encountered an error:', error);
    throw new Error('Failed to fetch user settings. Please try again later.');
  }
};

// Fetch a single pioneer user settings
export const fetchSingleUserSettings = async (sellerId: String) => {
  try {
    logger.info(`Fetching user settings for seller ID: ${sellerId}`);
    const token = getTokenFromCookie();

    const response = await axiosClient.get(`/user-preferences/${sellerId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      logger.info(`Fetch single user settings successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch single user settings failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Fetch single user settings encountered an error:', error);
    throw new Error('Failed to fetch single user settings. Please try again later.');
  }
};

// Create new or update existing user settings
export const createUserSettings = async (formData: FormData) => {
  try {
    logger.info('Creating or updating user settings with formData..');
    const token = getTokenFromCookie();
    const headers = {
      ...getMultipartFormDataHeaders(),
      Authorization: `Bearer ${token}`
    };

    const response = await axiosClient.put('/user-preferences/add', formData, { headers });

    if (response.status === 200) {
      logger.info(`Create or update user settings successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Create or update user settings failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Create or update user settings encountered an error:', error);
    throw new Error('Failed to create or update user settings. Please try again later.');
  }
};

// Fetch the user location of the user
export const fetchUserLocation = async () => {
  try {
    logger.info('Fetching user location..');
    const token = getTokenFromCookie();
    const headers = {
      ...getMultipartFormDataHeaders(),
      Authorization: `Bearer ${token}`
    };

    const response = await axiosClient.get(`/user-preferences/location/me`, { headers });

    if (response.status === 200) {
      logger.info(`Fetch user location successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch user location failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Fetch user location encountered an error:', error);
    throw error;
  }
};