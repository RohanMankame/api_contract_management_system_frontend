
// Link to backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Link to backend Endpoints
export const API_ENDPOINTS = {
 
  LOGIN: '/login',
  PROTECTED: '/protected',
  

  USERS_FIRST: '/users-first',
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,  
  USER_CONTRACTS: (id) => `/users/${id}/contracts`,
  

  CLIENTS: '/clients',
  CLIENT_BY_ID: (id) => `/clients/${id}`,
  CLIENT_CONTRACTS: (id) => `/clients/${id}/contracts`,
  

  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCT_CONTRACTS: (id) => `/products/${id}/contracts`,
  

  CONTRACTS: '/contracts',
  CONTRACT_BY_ID: (id) => `/contracts/${id}`,
  CONTRACT_PRODUCTS: (id) => `/contracts/${id}/product`,
  

  SUBSCRIPTIONS: '/subscriptions',
  SUBSCRIPTION_BY_ID: (id) => `/subscriptions/${id}`,
  SUBSCRIPTION_TIERS: (id) => `/subscriptions/${id}/tiers`,
  

  SUBSCRIPTION_TIER_LIST: '/subscription-tiers',
  SUBSCRIPTION_TIER_BY_ID: (id) => `/subscription-tiers/${id}`,
  SUBSCRIPTION_TIER_SUBSCRIPTIONS: (id) => `/subscription-tiers/${id}/subscriptions`,
};