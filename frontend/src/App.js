import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ThemeModeProvider, useThemeMode } from './themes/ThemeContext';
import { lightTheme, darkTheme } from './themes/theme';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import NetworkMonitoringPage from './pages/NetworkMonitoringPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PasswordResetPage from './pages/PasswordResetPage';
import AddIPPage from './pages/AddIPPage';
import AssignDepartmentPage from './pages/AssignDepartmentPage';
import ViewMostVisitedWebsitesPage from './pages/ViewMostVisitedWebsitesPage';
import DepartmentWithHighestInternetUsagePage from './pages/DepartmentWithHighestInternetUsagePage';
import PredictiveAnalyticsPage from './pages/PredictiveAnalyticsPage';
import EvaluationPage from './pages/EvaluationPage';
import SupportDocumentationPage from './pages/SupportDocumentationPage';
import AboutUsPage from './pages/AboutUsPage';
import Error500Page from './pages/Error500Page';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

const ThemedApp = () => {
    const { mode } = useThemeMode();
    const theme = mode === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <ErrorBoundary>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/network-monitoring" element={<NetworkMonitoringPage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                            <Route path="/reports" element={<ReportsPage />} />
                            <Route path="/admin-settings" element={<AdminSettingsPage />} />
                            <Route path="/add-ip" element={<AddIPPage />} />
                            <Route path="/assign-department" element={<AssignDepartmentPage />} />
                            <Route path="/view-most-visited-websites" element={<ViewMostVisitedWebsitesPage />} />
                            <Route path="/department-with-highest-internet-usage" element={<DepartmentWithHighestInternetUsagePage />} />
                            <Route path="/predictive-analytics" element={<PredictiveAnalyticsPage />} />
                            <Route path="/evaluation" element={<EvaluationPage />} />
                            <Route path="/support" element={<SupportDocumentationPage />} />
                            <Route path="/about-us" element={<AboutUsPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password/:token" element={<PasswordResetPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/error-500" element={<Error500Page />} />
                        </Routes>
                    </MainLayout>
                </ErrorBoundary>
            </BrowserRouter>
        </ThemeProvider>
    );
};

const App = () => {
    return (
        <ThemeModeProvider>
            <ThemedApp />
        </ThemeModeProvider>
    );
};

export default App;
