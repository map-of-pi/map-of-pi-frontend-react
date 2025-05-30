import axiosClient from "@/config/client";
import logger from '../../logger.config.mjs';

// Function to Fetch Map Center
export const fetchMapCenter = async (type: 'search' | 'sell') => {
  try {
    logger.info('Fetching map center...');
    const response = await axiosClient.get(`/map-center/${type}`);

    if (response.status === 200) {
      logger.info(`Fetch map center successful with Status ${response.status}`, {
        data: response.data,
      });

      // Ensure proper access to nested data if present
      const mapCenter = response.data;

      // Log mapCenter to inspect its structure
      logger.info('Fetched map center details:', mapCenter);

      // Access coordinates based on the actual response structure
      const longitude = mapCenter?.coordinates[0];
      const latitude = mapCenter?.coordinates[1];
      const type = mapCenter?.type;

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
  } catch (error) {
    logger.error('Fetch map center encountered an error:', error);
    throw new Error('Failed to fetch map center. Please try again later.');
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
  } catch (error) {
    logger.error('Save map center encountered an error:', error);
    throw new Error('Failed to save map center. Please try again later.');
  }
};

export async function checkSanctionStatus(latitude: number, longitude: number) {
  try {
    logger.info(`Checking sanction status for coordinates: longitude ${longitude}, latitude ${latitude}`);

    const response = await axiosClient.post('/restrictions/check-sanction-status', {
      longitude,
      latitude
    });

    if (response.status === 200) {
      return response.data;
    } else {
      logger.error(`Check sanction status failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Check sanction status encountered an error:', error);
    throw new Error('Failed to check sanction status. Please try again later.');
  }
}