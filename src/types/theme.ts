export type ThemeType = 'professional-dark' | 'matrix-green' | 'clean-light';

export interface ThemeColors {
  // Brand Colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  
  // Surface Colors
  surfaceBg: string;
  surfaceElevated: string;
  surfaceSidebar: string;
  surfaceInput: string;
  surfaceBorder: string;
  surfaceHover: string;
  surfaceActive: string;
  
  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  textOnAccent: string;
  
  // Shadow Colors
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  
  // Filters
  logoFilter: string;
}

export interface Theme {
  id: ThemeType;
  name: string;
  description: string;
  colors: ThemeColors;
}

export const themes: Record<ThemeType, Theme> = {
  'professional-dark': {
    id: 'professional-dark',
    name: 'Professional Dark',
    description: 'Clean dark theme for focused development',
    colors: {
      // Brand Colors
      primary: '#007ACC',
      primaryDark: '#005A9F',
      primaryLight: '#4DA6D9',
      accent: '#FF6B35',
      success: '#3FB950',
      warning: '#D29922',
      error: '#F85149',
      
      // Surface Colors
      surfaceBg: '#0D1117',
      surfaceElevated: '#161B22',
      surfaceSidebar: '#21262D',
      surfaceInput: '#30363D',
      surfaceBorder: '#30363D',
      surfaceHover: '#262C36',
      surfaceActive: '#30363D',
      
      // Text Colors
      textPrimary: '#E6EDF3',
      textSecondary: '#7D8590',
      textMuted: '#656D76',
      textAccent: '#58A6FF',
      textOnAccent: '#FFFFFF',
      
      // Shadows
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      shadowMd: '0 3px 6px 0 rgba(0, 0, 0, 0.4)',
      shadowLg: '0 8px 24px 0 rgba(0, 0, 0, 0.5)',
      shadowXl: '0 16px 32px 0 rgba(0, 0, 0, 0.6)',
      
      // Filters
      logoFilter: 'none',
    }
  },
  
  'matrix-green': {
    id: 'matrix-green',
    name: 'Matrix Green',
    description: 'Futuristic neon green terminal theme',
    colors: {
      // Brand Colors
      primary: '#00FF41',
      primaryDark: '#00CC33',
      primaryLight: '#33FF66',
      accent: '#00CCAA',
      success: '#00FF41',
      warning: '#FFAA00',
      error: '#FF4444',
      
      // Surface Colors
      surfaceBg: '#000000',
      surfaceElevated: '#0a1208',
      surfaceSidebar: '#001a00',
      surfaceInput: '#003300',
      surfaceBorder: '#00AA22',
      surfaceHover: '#002200',
      surfaceActive: '#003300',
      
      // Text Colors
      textPrimary: '#00FF41',
      textSecondary: '#00CC33',
      textMuted: '#009922',
      textAccent: '#00CCAA',
      textOnAccent: '#000000',
      
      // Shadows
      shadowSm: '0 1px 2px 0 rgba(0, 255, 65, 0.2)',
      shadowMd: '0 3px 6px 0 rgba(0, 255, 65, 0.25)',
      shadowLg: '0 8px 24px 0 rgba(0, 255, 65, 0.3)',
      shadowXl: '0 16px 32px 0 rgba(0, 255, 65, 0.35)',
      
      // Filters
      logoFilter: 'hue-rotate(120deg) saturate(1.2) brightness(1.1)',
    }
  },
  
  'clean-light': {
    id: 'clean-light',
    name: 'Clean Light',
    description: 'Bright, minimal theme for daytime work',
    colors: {
      // Brand Colors
      primary: '#0969DA',
      primaryDark: '#0550AE',
      primaryLight: '#54A3FF',
      accent: '#FF6B35',
      success: '#1A7F37',
      warning: '#9A6700',
      error: '#CF222E',
      
      // Surface Colors
      surfaceBg: '#FFFFFF',
      surfaceElevated: '#F8F9FA',
      surfaceSidebar: '#F1F3F4',
      surfaceInput: '#FFFFFF',
      surfaceBorder: '#DEE2E6',
      surfaceHover: '#E9ECEF',
      surfaceActive: '#DEE2E6',
      
      // Text Colors
      textPrimary: '#212529',
      textSecondary: '#6C757D',
      textMuted: '#ADB5BD',
      textAccent: '#0969DA',
      textOnAccent: '#FFFFFF',
      
      // Shadows
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      shadowMd: '0 3px 6px 0 rgba(0, 0, 0, 0.1)',
      shadowLg: '0 8px 24px 0 rgba(0, 0, 0, 0.15)',
      shadowXl: '0 16px 32px 0 rgba(0, 0, 0, 0.2)',
      
      // Filters
      logoFilter: 'brightness(0.2)',
    }
  }
};