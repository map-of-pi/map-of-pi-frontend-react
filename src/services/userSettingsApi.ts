import axiosClient from "@/config/client";
import { IUserSettings } from "@/constants/types";
import { handleAxiosError } from "@/util/error";

import logger from '../../logger.config.mjs';

// Fetch the user settings of the user
export const fetchUserSettings = async () => {
  try {
    logger.info('Fetching user settings..');
    const response = await axiosClient.post(`/user-preferences/me`);
    if (response.status === 200) {
      logger.info(`Fetch user settings successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch user settings failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Fetch user settings encountered an error:', { error });
    handleAxiosError(error);
    throw error;
  }
};

// Fetch a single pioneer user settings
export const fetchSingleUserSettings = async (sellerId: String) => {
  try {
    logger.info(`Fetching user settings for seller ID: ${sellerId}`);
    const response = await axiosClient.get(`/user-preferences/${sellerId}`);
    if (response.status === 200) {
      logger.info(`Fetch single user settings successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch single user settings failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Fetch single user settings encountered an error:', { error, sellerId });
    handleAxiosError(error);
    throw error;
  }
};

// Create new or update existing user settings
export const createUserSettings = async (formData: IUserSettings) => {
  try {
    logger.info('Creating or updating user settings with formData..');
    const response = await axiosClient.put('/user-preferences/add', {json: JSON.stringify(formData)});
    if (response.status === 200) {
      logger.info(`Create or update user settings successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Create or update user settings failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Create or update user settings encountered an error:', { error, formData });
    handleAxiosError(error);
    throw error;
  }
};
