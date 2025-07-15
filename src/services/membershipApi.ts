import axiosClient from "@/config/client";
import { IMembership } from "@/constants/types";
import logger from "../../logger.config.mjs"

// Fetch current user’s membership
export const fetchMembership = async (membership_id: string): Promise<IMembership | null> => {
  try {
    logger.info(`Fetching user membership: ${membership_id}`);
    const response = await axiosClient.get(`/membership`);
    if (response.status === 200) {
      logger.info(`Fetch user membership successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch user membership failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Fetch user membership encountered an error:', error);
    throw new Error('Failed to fetch user membership. Please try again later.');
  }
};

// Upgrade or create membership
export const manageMembership = async (data: {
  membership_class: string;
  membership_duration: number;
  mappi_allowance: number;
}) => {
  const response = await axiosClient.put("/memberships/manage", data, {
    withCredentials: true,
  });
    return response.data;
};