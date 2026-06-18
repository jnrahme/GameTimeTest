import { Platform } from 'react-native';

export const colors = {
  brandBlack: '#0E0E0F',
  appBackground: '#010314',
  ink: '#FFFFFF',
  charcoal: '#1C1C20',
  muted: '#8E9098',
  subtle: '#C4C7CF',
  paper: '#010314',
  surface: '#1C1C20',
  surfaceWarm: '#26262B',
  line: '#313136',
  lineStrong: '#5A5A5A',
  accent: '#66FAC8',
  accentPressed: '#35E5AD',
  success: '#66FAC8',
  danger: '#FF5A6B',
  scrim: 'rgba(23, 20, 18, 0.58)',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radii = {
  sm: 4,
  md: 8,
  round: 999,
};

export const typography = {
  family: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }),
  sizes: {
    caption: 12,
    label: 13,
    body: 16,
    title: 20,
    section: 24,
    hero: 36,
  },
  // Cap font scaling on large display text so big accessibility text sizes do
  // not break fixed layouts. Body text is left uncapped to scale freely.
  displayMaxScale: 1.3,
};

export const shadows = {
  raised: Platform.select({
    web: {
      boxShadow: '0 18px 55px rgba(0, 0, 0, 0.36)',
    },
    default: {
      shadowColor: '#000000',
      shadowOpacity: 0.28,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
      elevation: 7,
    },
  }),
  subtle: Platform.select({
    web: {
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.22)',
    },
    default: {
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 3,
    },
  }),
};
