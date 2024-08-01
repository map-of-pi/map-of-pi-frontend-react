import axiosClient from "@/config/client";
import { IUserSettings } from "@/constants/types";
import { toast } from "react-toastify";

// Fetch a single pioneer user
export const fetchUser = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/users/${userId}`);
    console.log('Pioneer user ', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pioneer user with ID ${userId}: `, error);
    throw error;
  }
};

// Fetch a single pioneer user configuration settings
export const fetchUserSettings = async () => {
  try {
    const response = await axiosClient.get(`/user-preferences/me`);
    return response.data;

  } catch (error: any) {
    if (error.response && error.response.data) {
      toast.info(error.response.data.message);
      return null
    }
    console.error(`Error fetching Pioneer user settings: `, error);
    throw error;
  }
};

// Create new pioneer user settings
export const createUserSettings = async (formData: IUserSettings) => {
  try {
    const response = await axiosClient.post('/user-preferences/add', {json: JSON.stringify(formData)});
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      toast.info(error.response.data.message);
    }else {
      toast.error('Error setting user preference');
    }
    return null;
  }
};


