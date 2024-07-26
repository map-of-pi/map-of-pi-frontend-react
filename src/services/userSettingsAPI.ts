import axiosClient from "@/config/client";


// Fetch a single pioneer user
export const fetchUser = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/users/${userId}`);
    console.log('Pioneer user ', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pioneer user with ID ${userId}:`, error);
    throw error;
  }
};

// Fetch a single pioneer user configuration settings
export const fetchUserSettings = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pioneer user settings with ID ${userId}:`, error);
    throw error;
  }
};

// Create new pioneer user settings
export const createUserSettings = async (userId: string, formData: FormData) => {
  try {
    const response = await axiosClient.post(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering new seller: ', error);
    throw error;
  }
};

// Update pioneer user settings
export const updateUserSettings = async (userId: string, formData: FormData) => {
  try {
    const response = await axiosClient.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating Pioneer user settings with ID ${userId}:`, error);
    throw error;
  }
};

