'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeType, themes, Theme } from '@/types/theme';

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: Theme;
  setTheme: (themeId: ThemeType) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('professional-dark');
  const [isClient, setIsClient] = useState(false);

  // Initialize theme from localStorage on client side
  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('jstcode-theme') as ThemeType;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to CSS custom properties
  useEffect(() => {
    if (!isClient) return;
    
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    // Apply theme colors to CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });
    
    // Set theme data attribute for CSS selectors
    root.setAttribute('data-theme', currentTheme);
    
    // Save to localStorage
    localStorage.setItem('jstcode-theme', currentTheme);
  }, [currentTheme, isClient]);

  const setTheme = (themeId: ThemeType) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  const availableThemes = Object.values(themes);

  return (
    <ThemeContext.Provider 
      value={{ 
        currentTheme, 
        theme: themes[currentTheme], 
        setTheme, 
        availableThemes 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}