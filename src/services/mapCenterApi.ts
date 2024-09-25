import axiosClient from "@/config/client";
import { handleAxiosError } from "@/utils/error";

import logger from '../../logger.config.mjs';

// Function to Fetch Map Center
// Function to Fetch Map Center
export const fetchMapCenter = async (centerType: 'search' | 'sell') => {
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
      let longitude, latitude, type;

      if (centerType === 'sell' && mapCenter?.sell_map_center) {
        longitude = mapCenter.sell_map_center.coordinates[0];
        latitude = mapCenter.sell_map_center.coordinates[1];
        type = mapCenter.sell_map_center.type;
      } else if (centerType === 'search' && mapCenter?.search_map_center) {
        longitude = mapCenter.search_map_center.coordinates[0];
        latitude = mapCenter.search_map_center.coordinates[1];
        type = mapCenter.search_map_center.type;
      }

      // Verify extracted values
      logger.info('Extracted coordinates:', { longitude, latitude, type });

      if (latitude !== undefined && longitude !== undefined) {
        return { longitude, latitude, type };
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
    logger.info(`Sending map center with coordinates: longitude ${longitude}, latitude ${latitude}, type: ${type}`);
    
    const response = await axiosClient.put('/map-center/save', {
      longitude,
      latitude,
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
