import axios from 'axios';

import logger from '../../logger.config.mjs';

export const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // server responded with a status code out of the range of 2xx
      logger.error(`Error status: ${error.response.status}`, {
        data: error.response.data,
        headers: error.response.headers
      });
      throw new Error(error.response.data.message || 'Error processing request.');
    } else if (error.request) {
      // no response was received from server
      logger.error('No response received from server', {
        request: error.request,
        config: error.config
      });
      throw new Error('No response from server. Please try again later.');
    } else {
      // something happened in setting up the request
      logger.error('Error setting up request:', {
        message: error.message,
        config: error.config
      });
      throw new Error('Error setting up the request. Please try again.');
    }
  } else {
    // non-Axios error
    logger.error('Unexpected error:', {
      error: error.toString(),
      stack: error.stack || 'No stack trace available.'
    });
    throw new Error('An unexpected error occurred. Please try again.');
  }
};
