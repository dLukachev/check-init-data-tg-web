import axios from 'axios';

const API_BASE_URL = 'https://backend-bar.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Telegram init data to requests when available
api.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp;
  
  if (tg?.initData) {
    config.headers['Telegram-Init-Data'] = tg.initData;
    // Log initData for debugging (remove in production)
    console.log('Using Telegram initData in request headers:', tg.initData.substring(0, 50) + '...');
    
    // Add user info as query params for better debugging
    if (tg.initDataUnsafe?.user?.id && config.url.includes('/auth/login/telegram')) {
      config.params = {
        ...config.params,
        user_id: tg.initDataUnsafe.user.id,
        debug: true
      };
    }
  } else {
    // Log warning if initData is missing
    console.warn('Telegram initData is missing. Backend requests may fail authentication.');
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Special handling for 401 Unauthorized errors
      if (error.response.status === 401) {
        console.error('Authorization failed. Telegram initData might be invalid or expired.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  loginWithTelegram: async () => {
    try {
      // Check if Telegram initData is available before attempting authentication
      const tg = window.Telegram?.WebApp;
      if (!tg?.initData) {
        throw new Error('Telegram initData is missing. Cannot authenticate.');
      }
      
      console.log('Attempting Telegram authentication...');
      const response = await api.post('/auth/login/telegram');
      console.log('Authentication successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error details:', error.message);
      
      // Create a more user-friendly error message
      let errorMessage = 'Failed to authenticate. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed: Invalid or expired Telegram data.';
      } else if (!window.navigator.onLine) {
        errorMessage = 'Network connection lost. Please check your internet connection.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. The server might be unavailable.';
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },
};

export const userService = {
  getCurrentUser: async () => {
    try {
      // Check if Telegram initData is available before fetching user data
      const tg = window.Telegram?.WebApp;
      if (!tg?.initData) {
        throw new Error('Telegram initData is missing. Cannot fetch user data.');
      }
      
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      
      // Create a more user-friendly error message
      let errorMessage = 'Failed to fetch user data.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authorization failed: Invalid or expired Telegram data.';
      } else if (!window.navigator.onLine) {
        errorMessage = 'Network connection lost. Please check your internet connection.';
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },
};

export default api; 