export const extractArray = (response) => {
  const payload = response?.data?.data ?? response?.data ?? response;
  return Array.isArray(payload) ? payload : [];
};

