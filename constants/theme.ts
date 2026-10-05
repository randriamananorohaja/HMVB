/**
 * VolleyTeam Design System
 * Colors extracted from the UX mockups
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#F0F4F8',
    card: '#FFFFFF',
    border: '#E5E7EB',
    tint: '#1E6FD9',
    primary: '#1E6FD9',
    primaryDark: '#0A2540',
    header: '#0A2540',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#1E6FD9',
    inputBg: '#F9FAFB',
    progressBg: '#E5E7EB',
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    background: '#0F172A',
    card: '#1E293B',
    border: '#334155',
    tint: '#3B82F6',
    primary: '#3B82F6',
    primaryDark: '#0A2540',
    header: '#0A2540',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    icon: '#9CA3AF',
    tabIconDefault: '#64748B',
    tabIconSelected: '#3B82F6',
    inputBg: '#1E293B',
    progressBg: '#334155',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
