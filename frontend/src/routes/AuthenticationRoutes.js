import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// project imports
import Loadable from '../components/Loadable';
import MinimalLayout from '../layouts/MinimalLayout';

// login routing
const AuthLogin = Loadable(lazy(() => import('../pages/auth/LoginPage')));
const AuthRegister = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
const AuthForgotPassword = Loadable(lazy(() => import('../pages/auth/ForgotPasswordPage')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = () => {
  return (
    <MinimalLayout>
      <Routes>
        <Route path="login" element={<AuthLogin />} />
        <Route path="register" element={<AuthRegister />} />
        <Route path="forgot-password" element={<AuthForgotPassword />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </MinimalLayout>
  );
};

export default AuthenticationRoutes;
