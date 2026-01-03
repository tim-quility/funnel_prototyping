import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { themes, Theme } from '../themes';

interface ThemeContextType {
  theme: string;
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const commonColors = {
    'quility-medium-dark-green': '#337973',
    'quility-dark-hover': '#44bbaa',
    'quility-block-bg': '#ffffff',
    'quility-nested-block-bg': '#ffffff',
    'quility-block-header-bg': '#ffffff',
    'quility-nested-block-header-bg': '#f1f1f1',
    'quility-hover-grey': '#f1f1f1',
    'quility-light-bg': '#ffffff',
    'quility-accent-bg': '#f1f1f1',
    'quility-veil': '#003e3a75',
    'quility-burst': '#000000',
    'quility-light-hover': '#daf3f0',
    'quility-border': '#d0d0d0',
    'quility-dark-text': '#000000',
    'quility-light-text': '#ffffff',
    'quility-input-bg': '#f8f8f8',
    'quility-input-border': '#a4a4a4bf',
    'quility-deactive': '#a1c3be',
    'quility-header': '#f1f1f1',
    'quility-close-button': '#44bbaa',
    'quility-dark-grey': '#707070',
    'quility-light-green': '#cbfbef',
};

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
  const [theme, setTheme] = useState('default-mint');

  useEffect(() => {
    const savedTheme = localStorage.getItem('funnel-theme') || 'default-mint';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const activeTheme = themes.find(t => t.id === theme);
    if (activeTheme) {
      const allColors = { ...commonColors, ...activeTheme.colors };
      for (const [key, value] of Object.entries(allColors)) {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      }
      localStorage.setItem('funnel-theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
