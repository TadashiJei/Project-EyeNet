import { createTheme } from '@mui/material/styles';

// Common theme settings
const commonSettings = {
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '0.875rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                },
            },
        },
    },
};

// Light theme
export const lightTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'light',
        primary: {
            main: '#2563eb',
            light: '#60a5fa',
            lighter: '#dbeafe',
            dark: '#1d4ed8',
        },
        secondary: {
            main: '#7c3aed',
            light: '#a78bfa',
            dark: '#5b21b6',
        },
        error: {
            main: '#dc2626',
            light: '#ef4444',
            dark: '#b91c1c',
        },
        warning: {
            main: '#d97706',
            light: '#f59e0b',
            dark: '#b45309',
        },
        info: {
            main: '#0891b2',
            light: '#06b6d4',
            dark: '#0e7490',
        },
        success: {
            main: '#059669',
            light: '#10b981',
            dark: '#047857',
        },
        grey: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },
        background: {
            default: '#f9fafb',
            paper: '#ffffff',
        },
        text: {
            primary: '#111827',
            secondary: '#4b5563',
        },
        divider: '#e5e7eb',
    },
});

// Dark theme
export const darkTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'dark',
        primary: {
            main: '#60a5fa',
            light: '#93c5fd',
            lighter: '#1e3a8a',
            dark: '#3b82f6',
        },
        secondary: {
            main: '#a78bfa',
            light: '#c4b5fd',
            dark: '#7c3aed',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        info: {
            main: '#06b6d4',
            light: '#22d3ee',
            dark: '#0891b2',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        grey: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },
        background: {
            default: '#111827',
            paper: '#1f2937',
        },
        text: {
            primary: '#f9fafb',
            secondary: '#d1d5db',
        },
        divider: '#374151',
    },
});