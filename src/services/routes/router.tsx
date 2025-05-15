import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Example from '@/pages/example/Example'
import { createBrowserRouter, Navigate } from 'react-router'
import { AppConstantRoutes } from './path'

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
    element: <Login />,
  },
  {
    path: AppConstantRoutes.paths.auth.register,
    element: <Register />,
  },
  {
    path: AppConstantRoutes.paths.example.default,
    element: <Example />,
  },

  // ** The following paths are all protected by SecureRoute component
  //   {
  //     path: AppConstantRoutes.paths.default,
  //     element: (
  //       <SecureRoute>
  //         <LayoutWithAuth />
  //       </SecureRoute>
  //     ),
  //     children: [
  //       {
  //         path: AppConstantRoutes.paths.home,
  //         element: <Home />,
  //       },
  //       {
  //         path: AppConstantRoutes.paths.searchPage,
  //         element: <SearchPage />,
  //       },
  //       {
  //         path: AppConstantRoutes.paths.musictypePage(':title'), // <-- Dynamic Path
  //         element: <MusictypePage />,
  //       },
  //       {
  //         path: '',
  //         element: <Navigate to={AppConstantRoutes.paths.home} replace />,
  //       },
  //       {
  //         path: AppConstantRoutes.paths.profile,
  //         element: <Profile />,
  //       },
  //       {
  //         path: AppConstantRoutes.paths.songDetailPage(':id'), // <-- Dynamic Path
  //         element: <SongDetail />,
  //       },
  //       {
  //         path: AppConstantRoutes.paths.librabryPage,
  //         element: <Library />,
  //       },
  //     ],
  //   },
])
