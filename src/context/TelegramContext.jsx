import React, { createContext, useContext, useEffect, useState } from 'react';

const TelegramContext = createContext(null);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

// Helper to convert hex to rgb
const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
};

export const TelegramProvider = ({ children }) => {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [telegramAvailable, setTelegramAvailable] = useState(true);
  const [initDataError, setInitDataError] = useState(null);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    
    if (!telegram) {
      setTelegramAvailable(false);
      setInitDataError("Telegram WebApp is not available. Please open this app from Telegram.");
      console.error("Telegram WebApp is not available");
      return;
    }
    
    if (!telegram.initData) {
      setInitDataError("Telegram initData is missing. This app needs to be opened from Telegram.");
      console.error("Telegram initData is missing");
      // Still allow the app to initialize with limited functionality
    }
    
    try {
      // Set theme according to Telegram colors
      document.documentElement.style.setProperty(
        '--tg-theme-bg-color', 
        telegram.themeParams?.bg_color || '#ffffff'
      );
      document.documentElement.style.setProperty(
        '--tg-theme-text-color', 
        telegram.themeParams?.text_color || '#000000'
      );
      document.documentElement.style.setProperty(
        '--tg-theme-button-color', 
        telegram.themeParams?.button_color || '#3390ec'
      );
      document.documentElement.style.setProperty(
        '--tg-theme-button-text-color', 
        telegram.themeParams?.button_text_color || '#ffffff'
      );
      
      // Set RGB values for use with rgba
      const textColor = telegram.themeParams?.text_color || '#000000';
      const textColorRgb = hexToRgb(textColor);
      document.documentElement.style.setProperty(
        '--tg-theme-text-color-rgb', 
        `${textColorRgb.r}, ${textColorRgb.g}, ${textColorRgb.b}`
      );

      // Store Telegram object and user data
      setTg(telegram);
      setUser(telegram.initDataUnsafe?.user);
      
      // Expand app to full height if available
      if (telegram.ready && telegram.expand) {
        telegram.ready();
        telegram.expand();
      }
      
      setReady(true);
    } catch (error) {
      console.error("Error initializing Telegram WebApp:", error);
      setInitDataError(`Error initializing Telegram WebApp: ${error.message}`);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ 
      tg, 
      user, 
      ready, 
      telegramAvailable, 
      initDataError 
    }}>
      {children}
    </TelegramContext.Provider>
  );
}; 