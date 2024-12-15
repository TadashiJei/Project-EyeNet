import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// routes
import MainRoutes from './routes/MainRoutes';
import AuthenticationRoutes from './routes/AuthenticationRoutes';

// theme
import { ThemeSettings } from './theme/Theme';

// ==============================|| APP ||============================== //

const App = () => {
  const theme = ThemeSettings();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/*" element={<MainRoutes />} />
            <Route path="/auth/*" element={<AuthenticationRoutes />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
