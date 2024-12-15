import { createTheme } from '@mui/material/styles';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
  const color = {
    paper: customization.isDarkMode ? '#1a223f' : '#ffffff',
    primaryLight: customization.isDarkMode ? '#1a223f' : '#f3f6f9',
    primary: '#2196f3',
    primaryDark: '#1e88e5',
    secondary: '#f50057',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    grey: '#9e9e9e'
  };

  const themeOption = {
    colors: color,
    heading: color.grey[800],
    paper: color.paper,
    backgroundDefault: customization.isDarkMode ? '#111936' : '#f4f5f7',
    background: customization.isDarkMode ? '#111936' : '#ffffff',
    darkTextPrimary: customization.isDarkMode ? '#ffffff' : '#11142d',
    darkTextSecondary: customization.isDarkMode ? '#b2bac2' : '#808e9b',
    textDark: customization.isDarkMode ? '#ffffff' : '#11142d',
    menuSelected: customization.isDarkMode ? '#1e88e5' : '#2196f3',
    menuSelectedBack: customization.isDarkMode ? '#1a223f' : '#e3f2fd',
    divider: customization.isDarkMode ? '#404854' : '#e6ebf1',
    customization
  };

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;
