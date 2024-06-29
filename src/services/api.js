import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1',
  
});

// Authenticate user
export const authenticateUser = async (uid, username) => {
  try {
    const response = await API.post('/users/authenticate', {
      auth: {
        user: {
          uid,
          username,
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

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

// Fetch all sellers or within bounds
export const fetchSellers = async (origin, radius) => {
  try {
    const params = origin && radius ? { origin, radius } : {};
    const response = await API.get('/sellers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }
};

// Fetch single seller by ID
export const fetchSingleSeller = async (sellerId) => {
  try {
    const response = await API.get(`/sellers/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Register a new seller
export const registerNewSeller = async (formData) => {
  try {
    const response = await API.post('/sellers/register', formData, {
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
    const response = await API.put(`/sellers/${sellerId}`, formData, {
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

// Fetch a single review for a seller
export const fetchSingleReview = async (reviewID) => {
  try {
    const response = await API.get(`/review-feedback/${reviewID}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching review with ID ${reviewID}:`, error);
    throw error;
  }
};

// Fetch reviews for a seller
export const fetchReviews = async (sellerId) => {
  try {
    const response = await API.get(`/review-feedback/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Create a new review
export const createReview = async (formData) => {
  try {
    const response = await API.post('/review-feedback/add', formData, {
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
    const response = await API.put(`/review-feedback/${reviewId}`, formData, {
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
