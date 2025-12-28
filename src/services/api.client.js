import axios from 'axios';
import { API_BASE_URL } from '../config/api';

//axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,  
  headers: {
    'Content-Type': 'application/json',  
  }
});


// use JWT stored in localStorage in header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// handle 401 errors globally
apiClient.interceptors.response.use(

  (response) => response, 

  (error) => {
    // JWT expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);  
  }
);

export default apiClient;