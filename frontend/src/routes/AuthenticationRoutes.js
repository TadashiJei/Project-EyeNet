import { lazy } from 'react';

// project imports
import Loadable from '../components/Loadable';
import MinimalLayout from '../layouts/MinimalLayout';

// login routing
const AuthLogin = Loadable(lazy(() => import('../pages/auth/LoginPage')));
const AuthRegister = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
const AuthForgotPassword = Loadable(lazy(() => import('../pages/auth/ForgotPasswordPage')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    },
    {
      path: '/forgot-password',
      element: <AuthForgotPassword />
    }
  ]
};

export default AuthenticationRoutes;
