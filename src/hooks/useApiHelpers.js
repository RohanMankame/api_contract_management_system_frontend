export const extractList = (response, key) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response?.data?.[key] && Array.isArray(response.data[key])) return response.data[key];
  if (response?.[key] && Array.isArray(response[key])) return response[key];
  return [];
};