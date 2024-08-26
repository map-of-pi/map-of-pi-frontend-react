import axiosClient from "@/config/client";
import { IUserSettings } from "@/constants/types";
import { handleAxiosError } from "@/util/error";

// Fetch a single pioneer user settings
export const fetchUserSettings = async () => {
  try {
    const response = await axiosClient.post(`/user-preferences/me`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Fetch user settings failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};

// Create new or update existing user settings
export const createUserSettings = async (formData: IUserSettings) => {
  try {
    const response = await axiosClient.put('/user-preferences/add', {json: JSON.stringify(formData)});
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Create user settings failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};

// Fetch a single pioneer user settings
export const fetchSellerSettings = async (sellerId: String) => {
  try {
    const response = await axiosClient.post(`/user-preferences/${sellerId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Fetch seller settings failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};
