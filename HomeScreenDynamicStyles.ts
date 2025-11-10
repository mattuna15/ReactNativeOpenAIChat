import { StyleSheet } from 'react-native';
import { colors, getThemeColors } from './colors';

// Dynamic styles for HomeScreen that depend on theme
export const createHomeScreenDynamicStyles = (isDarkMode: boolean) => {
  const themeColors = getThemeColors(isDarkMode);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    title: {
      color: themeColors.text,
    },
    textInput: {
      backgroundColor: themeColors.surface,
      color: themeColors.text,
      borderColor: themeColors.borderSecondary,
    },
    buttonDisabled: {
      opacity: colors.disabled,
    },
  });
};
