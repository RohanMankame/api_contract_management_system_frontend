// src/hooks/useApi.js
import { useCallback, useState } from 'react';
import apiClient from '../services/api.client';

export function useApi() {
  const [data, setData] = useState(null);          
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null);        

  const request = useCallback(async (config) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient(config);
      
      const responseData = response.data;
      
      setData(responseData);
      return responseData;

    } catch (err) {
      throw err; 

    } finally {
      setIsLoading(false);  
    }
  }, []);

  // HTTP method helpers
  const get = useCallback((url, config) => {
    return request({ ...config, method: 'GET', url });
  }, [request]);

  const post = useCallback((url, data, config) => {
    return request({ ...config, method: 'POST', url, data });
  }, [request]);

  const put = useCallback((url, data, config) => {
    return request({ ...config, method: 'PUT', url, data });
  }, [request]);

  const patch = useCallback((url, data, config) => {
    return request({ ...config, method: 'PATCH', url, data });
  }, [request]);

  const del = useCallback((url, config) => {
    return request({ ...config, method: 'DELETE', url });
  }, [request]);

  // Clear all state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  // Return all the tools
  return {
    data,
    isLoading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
  };
}