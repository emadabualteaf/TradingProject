import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

const lightTheme = {
  dark: false,
  colors: {
    background:    '#FFFFFF',
    surface:       '#F2F2F7',
    card:          '#FFFFFF',
    primary:       '#1A73E8',
    text:          '#1C1C1E',
    textSecondary: '#6B6B6B',
    border:        '#D1D1D6',
    tabBar:        '#FFFFFF',
    profit:        '#00C853',
    loss:          '#FF1744',
    warning:       '#FF9500',
    success:       '#34C759',
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background:    '#0D0D0D',
    surface:       '#1C1C1E',
    card:          '#2C2C2E',
    primary:       '#4A9EFF',
    text:          '#FFFFFF',
    textSecondary: '#ABABAB',
    border:        '#3A3A3C',
    tabBar:        '#121212',
    profit:        '#32D74B',
    loss:          '#FF453A',
    warning:       '#FFD60A',
    success:       '#30D158',
  },
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true); // Default to dark for a trading app

  function toggleTheme() {
    setIsDark(function (prev) { return !prev; });
  }

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — any screen imports this instead of the raw context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
}
