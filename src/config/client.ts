import axios from 'axios';

const backendURL = process.env.NEXT_PUBLIC_API_URL;
const axiosClient = axios.create({ 
  baseURL: backendURL, 
  timeout: 20000, 
  withCredentials: true
});

export default axiosClient;