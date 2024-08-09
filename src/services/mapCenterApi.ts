import axiosClient from "@/config/client";
import { handleAxiosError } from "@/util/error";

// Function to Fetch Map Center
export const fetchMapCenter = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/map-center/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Fetch map center failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to Save Map Center
export const saveMapCenter = async (userId: string, latitude: number, longitude: number) => {
  try {
    const response = await axiosClient.post(`/api/v1/map-center`, {
      pi_uid: userId,
      latitude,
      longitude
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Save map center failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};
