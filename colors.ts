// Color theme system for the app
export const colors = {
  // Primary colors
  primary: '#007AFF',

  // Light theme
  light: {
    background: '#f5f5f5',
    surface: '#fff',
    text: '#000',
    textSecondary: '#666',
    border: '#ccc',
    borderSecondary: '#e0e0e0',
    placeholder: '#666',
  },

  // Dark theme
  dark: {
    background: '#000',
    surface: '#1a1a1a',
    text: '#fff',
    textSecondary: '#999',
    border: '#333',
    borderSecondary: '#555',
    placeholder: '#999',
  },

  // Semantic colors
  white: '#fff',
  black: '#000',
  // Overlay / modal backgrounds
  overlay: 'rgba(0,0,0,0.5)',

  // State colors
  disabled: 0.7,
};

// Helper function to get theme-specific colors
export const getThemeColors = (isDark: boolean) => ({
  background: isDark ? colors.dark.background : colors.light.background,
  surface: isDark ? colors.dark.surface : colors.light.surface,
  text: isDark ? colors.dark.text : colors.light.text,
  textSecondary: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
  border: isDark ? colors.dark.border : colors.light.border,
  borderSecondary: isDark ? colors.dark.borderSecondary : colors.light.borderSecondary,
  placeholder: isDark ? colors.dark.placeholder : colors.light.placeholder,
});
