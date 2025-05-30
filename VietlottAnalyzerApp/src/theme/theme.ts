import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Modern AI-focused color palette
export const colors = {
  // Primary AI Colors
  primary: '#6366F1', // Indigo - AI/Tech feel
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary Colors
  secondary: '#10B981', // Emerald - Success/Positive
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  
  // Accent Colors for Lottery Types
  power655: '#EF4444', // Red - Power 6/55
  mega645: '#06B6D4', // Cyan - Mega 6/45
  
  // AI Prediction Colors
  hotNumbers: '#F59E0B', // Amber - Hot numbers
  coldNumbers: '#3B82F6', // Blue - Cold numbers
  balanced: '#8B5CF6', // Purple - Balanced
  aiEnsemble: '#EC4899', // Pink - AI Ensemble
  
  // Neutral Colors
  background: '#F8FAFC',
  backgroundDark: '#0F172A',
  surface: '#FFFFFF',
  surfaceDark: '#1E293B',
  
  // Text Colors
  text: '#1E293B',
  textLight: '#64748B',
  textDark: '#F1F5F9',
  textMuted: '#94A3B8',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Gradient Colors
  gradients: {
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#10B981', '#06B6D4'],
    power655: ['#EF4444', '#F97316'],
    mega645: ['#06B6D4', '#3B82F6'],
    ai: ['#8B5CF6', '#EC4899'],
    sunset: ['#F59E0B', '#EF4444'],
  },
  
  // Border Colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#334155',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
};

// Typography system
export const typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Border radius system
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadow system
export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Layout dimensions
export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isLargeDevice: width >= 414,
  headerHeight: 60,
  tabBarHeight: 80,
  statusBarHeight: 44,
};

// Component styles
export const components = {
  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  
  // Button styles
  button: {
    primary: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      ...shadows.sm,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      ...shadows.sm,
    },
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSize.base,
    backgroundColor: colors.surface,
  },
  
  // Lottery ball styles
  lotteryBall: {
    small: {
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: typography.fontSize.sm,
    },
    medium: {
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: typography.fontSize.base,
    },
    large: {
      width: 56,
      height: 56,
      borderRadius: 28,
      fontSize: typography.fontSize.lg,
    },
  },
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// AI-specific theme elements
export const aiTheme = {
  // Gradient backgrounds for AI features
  gradientBackgrounds: {
    predictions: {
      colors: colors.gradients.ai,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    statistics: {
      colors: colors.gradients.primary,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    power655: {
      colors: colors.gradients.power655,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    mega645: {
      colors: colors.gradients.mega645,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
  
  // AI confidence indicators
  confidenceColors: {
    high: colors.success, // 80%+
    medium: colors.warning, // 60-79%
    low: colors.error, // <60%
  },
  
  // Algorithm-specific colors
  algorithmColors: {
    hotNumbers: colors.hotNumbers,
    coldNumbers: colors.coldNumbers,
    balanced: colors.balanced,
    aiEnsemble: colors.aiEnsemble,
  },
  
  // Modern glassmorphism effect
  glassmorphism: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  
  // Neon glow effects for AI elements
  neonGlow: {
    primary: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
    },
    secondary: {
      shadowColor: colors.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
    },
  },
};

// Dark theme
export const darkTheme = {
  ...colors,
  background: colors.backgroundDark,
  surface: colors.surfaceDark,
  text: colors.textDark,
  border: colors.borderDark,
  shadow: colors.shadowDark,
};

// Export default theme
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  components,
  animations,
  aiTheme,
  darkTheme,
};

export default theme;
