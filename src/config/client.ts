import axios from 'axios';

const backendURL = process.env.NEXT_PUBLIC_API_URL;
const axiosClient = axios.create({ 
  baseURL: backendURL, 
  timeout: 20000, 
  withCredentials: true
});

export const setAuthToken = (token: string) => {
  if (token) {
    return (axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`);
  } else {
    return delete axiosClient.defaults.headers.common['Authorization'];
  }
};

export default axiosClient;
