import axios from 'axios';

// const baseUrl = process.env.NODE_ENV !=="development"? process.env.NEXT_LOCAL_URL : process.env.NEXT_REMOTE_URL
const baseUrl = "http://localhost:8001"

const axiosClient = axios.create({
  baseURL: `${baseUrl}`,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export const setAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common['Authorization'];
  }
};

export default axiosClient;
