export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#1A1A1A',
    textSecondary: '#666666',
    accent: '#E25822',
    border: '#E0E0E0',
    tabBar: '#FFFFFF',
    tabBarActive: '#E25822',
    tabBarInactive: '#999999',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontFamily: 'SpaceMono',
    sizes: {
      sm: 12,
      md: 16,
      lg: 20,
      xl: 32,
    },
  },
} as const;

export const nordTheme = {
  colors: {
    background: '#2E3440',
    surface: '#3B4252',
    text: '#ECEFF4',
    textSecondary: '#D8DEE9',
    accent: '#E25822',
    border: '#4C566A',
    tabBar: '#2E3440',
    tabBarActive: '#E25822',
    tabBarInactive: '#4C566A',
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
} as const;

export type AppTheme = typeof lightTheme;
