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

// Create new pioneer user settings
export const createUserSettings = async (userId, formData) => {
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

// Fetch a single review for a seller
export const fetchSingleReview = async (reviewID) => {
  try {
    const response = await API.get(`/reviews/${reviewID}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching review with ID ${reviewID}:`, error);
    throw error;
  }
};


// Fetch reviews for a seller
export const fetchReviews = async (sellerId) => {
  try {
    const response = await API.get(`/reviews/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Create a new review
export const createReview = async (formData) => {
  try {
    const response = await API.post('/reviews/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId, formData) => {
  try {
    const response = await API.put(`/reviews/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating review with ID ${reviewId}:`, error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await API.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting review with ID ${reviewId}:`, error);
    throw error;
  }
};
