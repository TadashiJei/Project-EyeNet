import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import colors from './colors';

const ThemeContext = createContext({
    mode: 'light',
    toggleMode: () => {},
    theme: null,
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('light');

    // Load theme mode from localStorage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode) {
            setMode(savedMode);
        }
    }, []);

    const toggleMode = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    const theme = createTheme({
        palette: {
            mode,
            ...colors[mode],
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            h1: {
                fontWeight: 600,
                fontSize: '2.375rem',
                lineHeight: 1.21
            },
            h2: {
                fontWeight: 600,
                fontSize: '1.875rem',
                lineHeight: 1.27
            },
            h3: {
                fontWeight: 600,
                fontSize: '1.5rem',
                lineHeight: 1.33
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.25rem',
                lineHeight: 1.4
            },
            h5: {
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.5
            },
            h6: {
                fontWeight: 400,
                fontSize: '0.875rem',
                lineHeight: 1.57
            },
            body1: {
                fontSize: '0.875rem',
                lineHeight: 1.57
            },
            body2: {
                fontSize: '0.75rem',
                lineHeight: 1.66
            },
            subtitle1: {
                fontSize: '0.875rem',
                fontWeight: 600,
                lineHeight: 1.57
            },
            subtitle2: {
                fontSize: '0.75rem',
                fontWeight: 500,
                lineHeight: 1.66
            },
            button: {
                textTransform: 'none',
                fontWeight: 600
            }
        },
        shape: {
            borderRadius: 8
        },
        shadows: [
            'none',
            '0px 2px 4px rgba(0, 0, 0, 0.075)',
            '0px 4px 8px rgba(0, 0, 0, 0.075)',
            '0px 8px 16px rgba(0, 0, 0, 0.075)',
            '0px 12px 24px rgba(0, 0, 0, 0.075)',
            '0px 16px 32px rgba(0, 0, 0, 0.075)',
            '0px 20px 40px rgba(0, 0, 0, 0.075)',
            ...Array(17).fill('none')
        ],
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: mode === 'dark' 
                            ? '0px 2px 4px rgba(0, 0, 0, 0.3)' 
                            : '0px 2px 4px rgba(0, 0, 0, 0.075)'
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 600
                    }
                }
            }
        }
    });

    return (
        <ThemeContext.Provider value={{ mode, toggleMode, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};
