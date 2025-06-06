import axiosClient from '@/config/client';
import { getMultipartFormDataHeaders } from '@/utils/api';
import logger from '../../logger.config.mjs';
import { INotification } from '@/constants/types';

export const fetchNotificationApi = async ({pi_uid, skip, limit}: {pi_uid: string, skip: number, limit: number}) => {
  try {
    const headers = getMultipartFormDataHeaders();
    const response = await axiosClient.get(`/notification/get/${pi_uid}?skip=${skip}&limit=${limit}`, {
      headers,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      logger.error(
        `Fetch Notification failed with error status: ${response.status}`,
      );
      return null;
    }
  } catch (error) {
    logger.error('Fetch Notification failed with error:', error);
    throw error;
  }
};

export const sendNotification = async (data: INotification) => {
    try {
      const response = await axiosClient.post(`/notification/send`, data);
      if (response.status === 200) {
        logger.info(`Notification send successfully ${response.status}`, {
          data: response.data
        });
        return response.data;
      } else {
        logger.error(`Send notification failed with Status ${response.status}`);
        return null;
      }
    } catch (error) {
      logger.error('Send notification encountered an error:', error);
      throw new Error('Failed to Send notification. Please try again later.');
    }
  };

export const updateNotification = async (id: string) => {
    try {
      const response = await axiosClient.put(`/notification/update/${id}`);
      if (response.status === 200) {
        logger.info(`Notification send successfully ${response.status}`, {
          data: response.data
        });
        return response.data;
      } else {
        logger.error(`Send notification failed with Status ${response.status}`);
        return null;
      }
    } catch (error) {
      logger.error('Send notification encountered an error:', error);
      throw new Error('Failed to Send notification. Please try again later.');
    }
  };