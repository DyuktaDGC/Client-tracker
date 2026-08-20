import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('../pages/dashboard/DashboardPage')).DashboardPage }) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
