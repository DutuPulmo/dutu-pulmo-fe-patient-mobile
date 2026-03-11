export const theme = {
  colors: {
    primary: '#0A7CFF',
    primaryAlt: '#007AFF',
    primaryDark: '#005ECB',
    secondary: '#22C55E',
    background: '#F5F7F8',
    surface: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#0A7CFF',
    success: '#10B981',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  typography: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  shadow: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
  },
  classes: {
    screen: 'flex-1 bg-[#F5F7F8]',
    container: 'px-4',
    card: 'rounded-2xl border border-slate-200 bg-white',
    buttonPrimary: 'bg-[#0A7CFF]',
    buttonSecondary: 'bg-slate-100',
    input: 'rounded-xl border border-slate-200 bg-white',
  },
} as const;

export type AppTheme = typeof theme;

export default theme;
