import axios from 'axios';

export const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // server responded with a status code out of the range of 2xx
      console.error(`Error status: ${error.response.status}`);
      console.error(`Error data: ${error.response.data}`);
      throw new Error(error.response.data.message || 'Error processing request');
    } else if (error.request) {
      // no response was received from server
      console.error('No response received from server');
      throw new Error('No response from server. Please try again later.');
    } else {
      // something happened in setting up the request
      console.error('Error setting up request:', error.message);
      throw new Error('Error setting up the request. Please try again.');
    }
  } else {
    // non-Axios error
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred. Please try again.');
  }
};
