import React, { createContext, useContext, useState, useMemo } from 'react';

const ThemeModeContext = createContext({
    mode: 'light',
    toggleMode: () => {},
});

export const useThemeMode = () => {
    const context = useContext(ThemeModeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within a ThemeModeProvider');
    }
    return context;
};

export const ThemeModeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    });

    const toggleMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            return newMode;
        });
    };

    const value = useMemo(
        () => ({
            mode,
            toggleMode,
        }),
        [mode]
    );

    return (
        <ThemeModeContext.Provider value={value}>
            {children}
        </ThemeModeContext.Provider>
    );
};