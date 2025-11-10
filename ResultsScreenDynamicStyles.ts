import { StyleSheet } from 'react-native';
import { getThemeColors } from './colors';

// Dynamic styles for ResultsScreen that depend on theme
export const createResultsScreenDynamicStyles = (isDarkMode: boolean) => {
  const themeColors = getThemeColors(isDarkMode);

  return StyleSheet.create({
    container: {
      backgroundColor: themeColors.background,
    },
    title: {
      color: themeColors.text,
    },
    promptCard: {
      backgroundColor: themeColors.surface,
      borderColor: themeColors.borderSecondary,
    },
    responseCard: {
      backgroundColor: themeColors.surface,
      borderColor: themeColors.borderSecondary,
    },
    cardTitle: {
      color: themeColors.text,
    },
    promptText: {
      color: themeColors.textSecondary,
    },
    responseText: {
      color: themeColors.textSecondary,
    },
  });
};
