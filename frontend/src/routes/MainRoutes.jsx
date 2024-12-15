import { lazy } from 'react';

// project imports
import AuthGuard from '../components/guards/AuthGuard';
import MainLayout from '../layouts/MainLayout';
import Loadable from '../components/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard')));

// monitoring routing
const Monitoring = Loadable(lazy(() => import('../pages/monitoring')));

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
      path: 'monitoring',
      element: <Monitoring />
    },
    {
      path: 'settings',
      element: <Settings />
    }
  ]
};

export default MainRoutes;
