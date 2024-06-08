// services/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});


// Fetch a single pioneer user
export const fetchUser = async (userId) => {
    try {
      const response = await API.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pioneer user with ID ${userId}:`, error);
      throw error;
    }
};


// Fetch a single pioneer user configuration settings
export const fetchUserSettings = async (userId) => {
    try {
      const response = await API.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pioneer user configuration settings with ID ${userId}:`, error);
      throw error;
    }
};

// Register a new seller
export const createUserSettings = async (formData) => {
    try {
      const response = await API.post(`/user/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error registering new seller:', error);
      throw error;
    }
};
  

// Update pioneer user settings
export const updateUserSettings = async (userId, formData) => {
    try {
      const response = await API.put(`/user/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating pioneer user configuration settings with ID ${userId}:`, error);
      throw error;
    }
};


// Fetch all sellers
export const fetchSellers = async () => {
  try {
    const response = await API.get('/seller');
    return response.data;
  } catch (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }
};

// Fetch single seller by ID
export const fetchSingleSeller = async (sellerId) => {
  try {
    const response = await API.get(`/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Register a new seller
export const registerNewSeller = async (formData) => {
  try {
    const response = await API.post('/seller/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering new seller:', error);
    throw error;
  }
};

// Update an existing seller
export const updateSeller = async (sellerId, formData) => {
  try {
    const response = await API.put(`/seller/${sellerId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Delete a seller
export const deleteSeller = async (sellerId) => {
  try {
    const response = await API.delete(`/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Fetch a seller ReviewFeedback
export const fetchSellerReview = async (sellerId) => {
    try {
      const response = await API.get(`/seller/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Review of seller with ID ${sellerId}:`, error);
      throw error;
    }
  };


