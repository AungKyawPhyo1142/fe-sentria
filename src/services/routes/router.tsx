import Container from '@/pages/auth/Container'
import Example from '@/pages/example/Example'
import { createBrowserRouter, Navigate } from 'react-router'
import { AppConstantRoutes } from './path'

import Welcome from '@/pages/onboarding/Welcome'
import StepsScroller from '@/pages/onboarding/StepsScroller'
import SecureRoute from '@/components/auth/SecureRoute'
import LayoutWithAuth from '@/components/layout/LayoutWithAuth'
import Home from '@/pages/user/Home'

import VerificationSent from '@/pages/auth/VerificationSent'
import Confirmed from '@/pages/auth/VerifyEmail'
import Profile from '@/pages/profile/Profile'
import MapPage from '@/pages/user/MapPage'

/*
  This file is where you define the routes
*/

export const getDefaultRoute = () => {
  return AppConstantRoutes.paths.home
}

// Define a default route handler
// if the user is already logged in, redirect to the dashboard
// otherwise, redirect to the login page
const handleDefaultRoute = () => {
  // TODO: replace this with the actual logic to check if the user is logged in
  return <Navigate to={AppConstantRoutes.paths.auth.login} />
}

export const router = createBrowserRouter([
  {
    path: '*',
    element: handleDefaultRoute(),
  },
  {
    path: AppConstantRoutes.paths.auth.login,
    element: <Container />,
  },
  {
    path: AppConstantRoutes.paths.auth.register,
    element: <Container />,
  },
  {
    path: AppConstantRoutes.paths.auth.sent,
    element: <VerificationSent />,
  },
  {
    path: AppConstantRoutes.paths.auth.confirmed,
    element: <Confirmed />,
  },
  {
    path: AppConstantRoutes.paths.example.default,
    element: <Example />,
  },
  {
    path: AppConstantRoutes.paths.onboarding.welcome,
    element: <Welcome />,
  },
  {
    path: AppConstantRoutes.paths.onboarding.steps,
    element: <StepsScroller />,
  },
  // temporary test route for profile page
  {
    path: AppConstantRoutes.paths.profile,
    element: <Profile />,
  },

  // ** The following paths are all protected by SecureRoute component
  {
    path: AppConstantRoutes.paths.default,
    element: (
      <SecureRoute>
        <LayoutWithAuth />
      </SecureRoute>
    ),
    children: [
      {
        path: AppConstantRoutes.paths.home,
        element: <Home />,
      },
      {
        path: '',
        element: <Navigate to={AppConstantRoutes.paths.home} replace />,
      },
      {
        path: AppConstantRoutes.paths.map,
        element: <MapPage />,
      },
      // {
      //   path: AppConstantRoutes.paths.profile,
      //   element: <Navigate to={AppConstantRoutes.paths.profile} replace />,
      // },
    ],
  },
])
