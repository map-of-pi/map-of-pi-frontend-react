import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export const setAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return (axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`);
  } else {
    return delete axiosClient.defaults.headers.common['Authorization'];
  }
};

export default axiosClient;
