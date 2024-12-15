import { lazy } from 'react';

// project imports
import AuthGuard from '../components/guards/AuthGuard';
import MainLayout from '../layouts/MainLayout';
import Loadable from '../components/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard')));

// monitoring routing
const NetworkMonitoring = Loadable(lazy(() => import('../pages/NetworkMonitoringPage')));
const DeviceManagement = Loadable(lazy(() => import('../pages/DeviceManagementPage')));

// settings routing
const Settings = Loadable(lazy(() => import('../pages/settings')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            element: <DashboardDefault />
        },
        {
            path: 'network-monitoring',
            element: <NetworkMonitoring />
        },
        {
            path: 'device-management',
            element: <DeviceManagement />
        },
        {
            path: 'settings',
            element: <Settings />
        }
    ]
};

export default MainRoutes;
