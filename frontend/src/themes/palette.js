/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

export default function themePalette(theme) {
  return {
    mode: theme.customization.isDarkMode ? 'dark' : 'light',
    common: {
      black: theme.colors.darkLevel1
    },
    primary: {
      light: theme.colors.primaryLight,
      main: theme.colors.primary,
      dark: theme.colors.primaryDark,
      200: theme.colors.primary200,
      800: theme.colors.primary800
    },
    secondary: {
      light: theme.colors.secondaryLight,
      main: theme.colors.secondary,
      dark: theme.colors.secondaryDark,
      200: theme.colors.secondary200,
      800: theme.colors.secondary800
    },
    error: {
      light: theme.colors.errorLight,
      main: theme.colors.error,
      dark: theme.colors.errorDark
    },
    warning: {
      light: theme.colors.warningLight,
      main: theme.colors.warning,
      dark: theme.colors.warningDark
    },
    success: {
      light: theme.colors.successLight,
      200: theme.colors.success200,
      main: theme.colors.success,
      dark: theme.colors.successDark
    },
    grey: {
      50: theme.colors.grey50,
      100: theme.colors.grey100,
      500: theme.darkTextSecondary,
      600: theme.heading,
      700: theme.darkTextPrimary,
      900: theme.textDark
    },
    text: {
      primary: theme.darkTextPrimary,
      secondary: theme.darkTextSecondary,
      dark: theme.textDark,
      hint: theme.colors.grey100
    },
    background: {
      paper: theme.paper,
      default: theme.backgroundDefault
    }
  };
}
