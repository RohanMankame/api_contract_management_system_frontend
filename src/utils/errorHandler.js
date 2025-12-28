export class ApiError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;        
    this.originalError = originalError;  
  }
}


export function parseApiError(error) {
  
  if (error.response) {
    
    const message = error.response.data?.message || 
                   error.response.data?.error || 
                   'An error occurred';
    
    return {
      message,
      statusCode: error.response.status,
      errors: error.response.data?.errors,  
      success: error.response.data?.success,
      originalError: error,
    };
  } 
  // If request was made but no response
  else if (error.request) {
    return {
      message: 'No response from server',
      statusCode: null,
      errors: null,
      success: false,
      originalError: error,
    };
  } 
  // Something else went wrong
  else {
    return {
      message: error.message || 'An unexpected error occurred',
      statusCode: null,
      errors: null,
      success: false,
      originalError: error,
    };
  }
}