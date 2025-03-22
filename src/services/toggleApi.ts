import axiosClient from "@/config/client";
import logger from '../../logger.config.mjs';

// Fetch a single toggle
export const fetchToggle = async (toggleName: string) => {
  try {
    logger.info(`Fetching toggle with ID: ${toggleName}`);
    const { data } = await axiosClient.get(`/toggles/${toggleName}`);
    logger.info(`Fetch toggle successful for ${toggleName}`, { data });
    return data;
  } catch (error) {
    logger.error(`Fetch toggle for ${ toggleName } encountered an error:`, error);
    throw new Error('Failed to fetch toggle. Please try again later.');
  }
};