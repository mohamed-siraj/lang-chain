const { REACT_APP_API_BASE_URL, REACT_APP_API_TIMEOUT } = process.env;

export const envConfig = {
  apiBaseURL: REACT_APP_API_BASE_URL || 'https://api.example.com',
  apiTimeout: REACT_APP_API_TIMEOUT ? parseInt(REACT_APP_API_TIMEOUT, 10) : 5000,
};