import { lazy } from 'react';

// project imports
import GuestGuard from '../components/guards/GuestGuard';
import Loadable from '../components/Loadable';
import AuthLayout from '../layouts/AuthLayout';

// login routing
const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
const ForgotPasswordPage = Loadable(lazy(() => import('../pages/auth/ForgotPasswordPage')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: (
    <GuestGuard>
      <AuthLayout />
    </GuestGuard>
  ),
  children: [
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/forgot-password',
      element: <ForgotPasswordPage />
    }
  ]
};

export default LoginRoutes;
