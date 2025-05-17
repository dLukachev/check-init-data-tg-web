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
  } else {
    // Log warning if initData is missing
    console.warn('Telegram initData is missing. Backend requests may fail authentication.');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  loginWithTelegram: async () => {
    try {
      // Check if Telegram initData is available before attempting authentication
      const tg = window.Telegram?.WebApp;
      if (!tg?.initData) {
        throw new Error('Telegram initData is missing. Cannot authenticate.');
      }
      
      const response = await api.post('/auth/login/telegram');
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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
      throw error;
    }
  },
};

export default api; 