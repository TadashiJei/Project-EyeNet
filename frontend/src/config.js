// theme constant
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;

const config = {
  // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs
  basename: '',
  defaultPath: '/dashboard',
  fontFamily: `'Public Sans', sans-serif`,
  borderRadius: 8,
  outlinedFilled: true,
  theme: 'light', // light, dark
  presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
  i18n: 'en', // en, fr, ro, zh
  rtlLayout: false,
  jwt: {
    secret: 'SECRET-KEY',
    timeout: '1 days'
  },
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID'
  }
};

export default config;
