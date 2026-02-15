import React, { createContext, useContext } from 'react';
import { useApp } from './AppContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { isDarkMode } = useApp();

  const lightColors = {
    primary: '#2196F3',
    secondary: '#E3F2FD',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
    placeholder: '#9E9E9E',
    shadow: '#000',
  };

  const darkColors = {
    primary: '#42A5F5',
    secondary: '#1E3A5F',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFA726',
    placeholder: '#666666',
    shadow: '#000',
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

