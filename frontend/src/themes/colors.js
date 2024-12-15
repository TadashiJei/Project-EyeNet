// Color system for the EyeNet dashboard
const colors = {
    // Light mode colors
    light: {
        primary: {
            lighter: '#E3F2FD',
            light: '#90CAF9',
            main: '#2196F3',
            dark: '#1E88E5',
            darker: '#1565C0',
            contrastText: '#fff'
        },
        secondary: {
            lighter: '#D1C4E9',
            light: '#9575CD',
            main: '#673AB7',
            dark: '#5E35B1',
            darker: '#4527A0',
            contrastText: '#fff'
        },
        success: {
            lighter: '#E8F5E9',
            light: '#81C784',
            main: '#4CAF50',
            dark: '#43A047',
            darker: '#2E7D32',
            contrastText: '#fff'
        },
        warning: {
            lighter: '#FFF8E1',
            light: '#FFB74D',
            main: '#FF9800',
            dark: '#F57C00',
            darker: '#E65100',
            contrastText: '#fff'
        },
        error: {
            lighter: '#FFEBEE',
            light: '#EF5350',
            main: '#F44336',
            dark: '#E53935',
            darker: '#C62828',
            contrastText: '#fff'
        },
        info: {
            lighter: '#E1F5FE',
            light: '#4FC3F7',
            main: '#03A9F4',
            dark: '#0288D1',
            darker: '#01579B',
            contrastText: '#fff'
        },
        grey: {
            0: '#FFFFFF',
            100: '#F8F9FA',
            200: '#F1F3F4',
            300: '#E8EAED',
            400: '#DFE1E5',
            500: '#BDC1C6',
            600: '#80868B',
            700: '#5F6368',
            800: '#3C4043',
            900: '#202124',
            A100: '#F5F5F5',
            A200: '#EEEEEE',
            A400: '#BDBDBD',
            A700: '#616161',
            contrastText: '#fff'
        },
        text: {
            primary: '#3C4043',
            secondary: '#5F6368',
            disabled: '#BDC1C6'
        },
        divider: 'rgba(0, 0, 0, 0.12)',
        background: {
            paper: '#FFFFFF',
            default: '#F8F9FA'
        },
        action: {
            active: 'rgba(0, 0, 0, 0.54)',
            hover: 'rgba(0, 0, 0, 0.04)',
            selected: 'rgba(0, 0, 0, 0.08)',
            disabled: 'rgba(0, 0, 0, 0.26)',
            disabledBackground: 'rgba(0, 0, 0, 0.12)',
            focus: 'rgba(0, 0, 0, 0.12)'
        }
    },
    // Dark mode colors
    dark: {
        primary: {
            lighter: '#1A237E',
            light: '#3949AB',
            main: '#3F51B5',
            dark: '#5C6BC0',
            darker: '#7986CB',
            contrastText: '#fff'
        },
        secondary: {
            lighter: '#311B92',
            light: '#4527A0',
            main: '#673AB7',
            dark: '#7E57C2',
            darker: '#9575CD',
            contrastText: '#fff'
        },
        success: {
            lighter: '#1B5E20',
            light: '#2E7D32',
            main: '#43A047',
            dark: '#66BB6A',
            darker: '#81C784',
            contrastText: '#fff'
        },
        warning: {
            lighter: '#E65100',
            light: '#EF6C00',
            main: '#F57C00',
            dark: '#FB8C00',
            darker: '#FFA726',
            contrastText: '#fff'
        },
        error: {
            lighter: '#B71C1C',
            light: '#C62828',
            main: '#D32F2F',
            dark: '#E53935',
            darker: '#EF5350',
            contrastText: '#fff'
        },
        info: {
            lighter: '#01579B',
            light: '#0277BD',
            main: '#0288D1',
            dark: '#039BE5',
            darker: '#29B6F6',
            contrastText: '#fff'
        },
        grey: {
            0: '#121212',
            100: '#1E1E1E',
            200: '#2C2C2C',
            300: '#3A3A3A',
            400: '#484848',
            500: '#565656',
            600: '#646464',
            700: '#727272',
            800: '#808080',
            900: '#8E8E8E',
            A100: '#2C2C2C',
            A200: '#3A3A3A',
            A400: '#646464',
            A700: '#808080',
            contrastText: '#fff'
        },
        text: {
            primary: '#E8EAED',
            secondary: '#BDC1C6',
            disabled: '#80868B'
        },
        divider: 'rgba(255, 255, 255, 0.12)',
        background: {
            paper: '#1E1E1E',
            default: '#121212'
        },
        action: {
            active: 'rgba(255, 255, 255, 0.54)',
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(255, 255, 255, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.26)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
            focus: 'rgba(255, 255, 255, 0.12)'
        }
    }
};

export default colors;
