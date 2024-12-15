import React from 'react';
import { lazy } from 'react';
import Loadable from '../components/Loadable';
import MonitoringDashboard from '../views/dashboard/MonitoringDashboard';

const Dashboard = Loadable(lazy(() => import('../pages/dashboard')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <MonitoringDashboard />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    }
  ]
};

export default MainRoutes;
