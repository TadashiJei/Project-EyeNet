import React from 'react';
import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loadable from '../components/Loadable';
import MonitoringDashboard from '../views/dashboard/MonitoringDashboard';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

const Dashboard = Loadable(lazy(() => import('../pages/dashboard')));

const MainRoutes = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<MonitoringDashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MainRoutes;
