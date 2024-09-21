import axiosClient from "@/config/client";
import { handleAxiosError } from "@/utils/error";

import logger from '../../logger.config.mjs';

// Function to Fetch Map Center
export const fetchMapCenter = async () => {
  try {
    logger.info('Fetching map center...');
    const response = await axiosClient.get('/map-center');

    if (response.status === 200) {
      logger.info(`Fetch map center successful with Status ${response.status}`, {
        data: response.data,
      });

      // Ensure proper access to nested data if present
      const mapCenter = response.data;

      // Log mapCenter to inspect its structure
      logger.info('Fetched map center details:', mapCenter);

      // Access coordinates based on the actual response structure
      const latitude = mapCenter?.sell_map_center?.coordinates?.[1] ?? mapCenter?.search_map_center?.coordinates?.[1];
      const longitude = mapCenter?.sell_map_center?.coordinates?.[0] ?? mapCenter?.search_map_center?.coordinates?.[0];
      const type = mapCenter?.sell_map_center?.type ?? mapCenter?.search_map_center?.type;

      // Verify extracted values
      logger.info('Extracted coordinates:', { latitude, longitude, type });

      if (latitude !== undefined && longitude !== undefined) {
        return { latitude, longitude, type };
      } else {
        logger.warn('Fetched map center has undefined coordinates, returning default.');
        return null;
      }
    } else {
      logger.error(`Fetch map center failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Fetch map center encountered an error:', { error });
    handleAxiosError(error);
    throw error;
  }
};

// Function to Save Map Center
export const saveMapCenter = async (latitude: number, longitude: number, type: 'search' | 'sell') => {
  try {
    logger.info(`Sending map center with coordinates: latitude ${latitude}, longitude ${longitude}, type: ${type}`);
    
    const response = await axiosClient.put('/map-center/save', {
      latitude,
      longitude,
      type
    });
    
    if (response.status === 200) {
      logger.info(`Save map center successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Save map center failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error('Save map center encountered an error:', { error });
    handleAxiosError(error);
    throw error;
  }
};

