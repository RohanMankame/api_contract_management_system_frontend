import axios from 'axios';
import { API_BASE_URL } from '../config/api';

//axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,  
  headers: {
    'Content-Type': 'application/json',  
  }
});

// Request interceptor with logging
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request
    console.log('📤 API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with logging
apiClient.interceptors.response.use(
  (response) => {
    // Log the response
    console.log('📥 API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log errors
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      error: error.response?.data
    });
    
    // JWT expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);  
  }
);

export default apiClient;